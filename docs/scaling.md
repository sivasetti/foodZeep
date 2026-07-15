# Scaling Guide

## Overview

Strategies for scaling FoodZeep from MVP to production-grade platform handling thousands of concurrent users.

---

## Current Architecture Limitations

| Component | MVP Limitation | Scaling Need |
|-----------|----------------|--------------|
| Server | Single Node.js instance | Multiple instances |
| Database | Single MySQL instance | Read replicas, sharding |
| File Storage | Local filesystem | Cloud storage (S3) |
| Cache | None | Redis cluster |
| Sessions | JWT (stateless) | Token blacklist |
| Queue | In-memory cron | Distributed queue |

---

## Scaling Phases

### Phase 1: Vertical Scaling (Current → 1K users)

**Goal:** Handle initial traffic with minimal changes.

#### Database Optimization

```sql
-- Add indexes for frequently queried columns
CREATE INDEX idx_food_seller ON food_items(seller_id);
CREATE INDEX idx_food_expiry ON food_items(expiry_time);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_order_items_order ON order_items(order_id);

-- Query optimization
EXPLAIN SELECT * FROM food_items WHERE seller_id = 1;
```

#### Connection Pool Tuning

```javascript
// backend/src/config/db.js
const pool = mysql.createPool({
  connectionLimit: 20,      // Increase from 10
  waitForConnections: true,
  connectTimeout: 10000,
  idleTimeout: 60000,
  queueLimit: 50            // New: limit waiting queue
});
```

#### Response Compression

```javascript
// backend/src/app.js
const compression = require('compression');
app.use(compression());
```

#### Caching Headers

```javascript
// Static assets
app.use('/uploads', express.static('uploads', {
  maxAge: '30d',
  immutable: true
}));
```

**Expected:** 1,000 concurrent users, <200ms response time.

---

### Phase 2: Horizontal Scaling (1K → 10K users)

**Goal:** Multiple server instances behind load balancer.

#### Load Balancer Setup

```nginx
# nginx.conf
upstream api_backend {
    least_conn;
    server localhost:5001;
    server localhost:5002;
    server localhost:5003;
}

server {
    listen 80;
    location / {
        proxy_pass http://api_backend;
    }
}
```

#### PM2 Cluster Mode

```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'foodzeep-api',
    script: 'server.js',
    instances: 'max',      // Use all CPU cores
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production'
    }
  }]
};
```

```bash
pm2 start ecosystem.config.js
pm2 status
```

#### Redis Integration

```javascript
// Install: npm install redis

// backend/src/config/redis.js
const redis = require('redis');
const client = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

client.connect();

module.exports = client;
```

#### Session Caching

```javascript
// Cache user profiles
const getUserById = async (id) => {
  // Check cache first
  const cached = await redis.get(`user:${id}`);
  if (cached) return JSON.parse(cached);

  // Fetch from database
  const user = await db.query('SELECT * FROM users WHERE id = ?', [id]);

  // Cache for 5 minutes
  await redis.set(`user:${id}`, JSON.stringify(user), { EX: 300 });

  return user;
};
```

#### Query Caching

```javascript
// Cache frequently accessed data
const getFoodById = async (id) => {
  const cacheKey = `food:${id}`;

  // Check cache
  const cached = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached);

  // Fetch from DB
  const food = await db.query('SELECT * FROM food_items WHERE id = ?', [id]);

  // Cache for 10 minutes
  await redis.set(cacheKey, JSON.stringify(food), { EX: 600 });

  return food;
};
```

#### CDN for Static Assets

```nginx
# Serve through CDN
location /uploads {
    proxy_pass https://cdn.foodzeep.com/uploads;
    expires 365d;
    add_header Cache-Control "public, immutable";
}
```

**Expected:** 10,000 concurrent users, <100ms response time.

---

### Phase 3: Database Scaling (10K → 100K users)

**Goal:** Handle high read/write throughput with database replication.

#### Read Replicas

```javascript
// backend/src/config/db.js
const masterPool = mysql.createPool({
  host: config.db.host,
  // ... master config
});

const replicaPool = mysql.createPool({
  host: config.db.replicaHost,
  // ... replica config
});

// Read from replica, write to master
const db = {
  query: async (sql, params) => {
    if (sql.trim().startsWith('SELECT')) {
      return replicaPool.query(sql, params);
    }
    return masterPool.query(sql, params);
  }
};
```

#### Database Sharding

```javascript
// Shard by user_id
const getShard = (userId) => {
  const shardId = userId % 4;  // 4 shards
  return shardPools[shardId];
};

const getUserOrders = async (userId) => {
  const pool = getShard(userId);
  return pool.query('SELECT * FROM orders WHERE user_id = ?', [userId]);
};
```

#### Connection Pooling (Proxy)

```bash
# Use ProxySQL for connection pooling
# Install and configure ProxySQL
sudo apt install proxysql

# Configure backends
INSERT INTO mysql_servers(hostgroup_id, hostname, port)
VALUES (1, 'localhost', 3306);
```

#### Query Optimization

```sql
-- Analyze slow queries
SET GLOBAL slow_query_log = 1;
SET GLOBAL long_query_time = 1;

-- Use EXPLAIN for query analysis
EXPLAIN SELECT * FROM orders
JOIN order_items ON orders.id = order_items.order_id
WHERE orders.user_id = 123;

-- Optimize with covering indexes
CREATE INDEX idx_orders_user_status ON orders(user_id, status);
```

**Expected:** 100,000 concurrent users, <50ms response time.

---

### Phase 4: Microservices (100K → 1M users)

**Goal:** Extract critical services for independent scaling.

#### Service Extraction

```
┌─────────────────────────────────────────────────────────┐
│                     API Gateway                         │
│                    (Kong / Express)                      │
└───────────┬───────────┬───────────┬───────────┬─────────┘
            │           │           │           │
            ▼           ▼           ▼           ▼
     ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
     │  Auth    │ │  Food    │ │  Orders  │ │  Users   │
     │ Service  │ │ Service  │ │ Service  │ │ Service  │
     └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘
          │            │            │            │
          ▼            ▼            ▼            ▼
     ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
     │ Auth DB  │ │ Food DB  │ │ Orders DB│ │ Users DB │
     └──────────┘ └──────────┘ └──────────┘ └──────────┘
```

#### Message Queue (BullMQ)

```javascript
// Install: npm install bullmq

const { Queue, Worker } = require('bullmq');

// Create queues
const orderQueue = new Queue('orders');
const notificationQueue = new Queue('notifications');

// Producer (in orders service)
await orderQueue.add('place-order', {
  userId: 123,
  items: [...],
  totalAmount: 500
});

// Worker (separate process)
const worker = new Worker('orders', async (job) => {
  const { userId, items, totalAmount } = job.data;

  // Process order
  await placeOrder(userId, items, totalAmount);

  // Send notification
  await notificationQueue.add('order-confirmed', {
    userId,
    orderId: order.id
  });
});
```

#### Service Communication

```javascript
// HTTP (synchronous)
const response = await axios.post('http://auth-service/validate', {
  token
});

// Message Queue (asynchronous)
await orderQueue.add('process-payment', {
  orderId,
  amount
});
```

#### Service Discovery

```javascript
// Consul integration
const consul = require('consul')();

// Register service
await consul.agent.service.register({
  name: 'food-service',
  address: 'localhost',
  port: 5001,
  check: {
    http: 'http://localhost:5001/health',
    interval: '10s'
  }
});

// Discover services
const services = await consul.health.service('auth-service');
```

**Expected:** 1,000,000 concurrent users, <20ms response time.

---

## Caching Strategy

### Cache Levels

| Level | Location | TTL | Use Case |
|-------|----------|-----|----------|
| L1 | Browser | 30 days | Static assets |
| L2 | CDN | 7 days | Images, CSS, JS |
| L3 | Redis | 5-60 min | API responses |
| L4 | Database | - | Persistent data |

### Cache Patterns

#### Cache-Aside

```javascript
const getProduct = async (id) => {
  // Check cache
  const cached = await redis.get(`product:${id}`);
  if (cached) return JSON.parse(cached);

  // Fetch from DB
  const product = await db.query('SELECT * FROM products WHERE id = ?', [id]);

  // Populate cache
  await redis.set(`product:${id}`, JSON.stringify(product), { EX: 3600 });

  return product;
};
```

#### Write-Through

```javascript
const updateProduct = async (id, data) => {
  // Update database
  await db.query('UPDATE products SET ? WHERE id = ?', [data, id]);

  // Update cache
  const product = await db.query('SELECT * FROM products WHERE id = ?', [id]);
  await redis.set(`product:${id}`, JSON.stringify(product), { EX: 3600 });

  return product;
};
```

#### Cache Invalidation

```javascript
const deleteProduct = async (id) => {
  // Delete from database
  await db.query('DELETE FROM products WHERE id = ?', [id]);

  // Invalidate cache
  await redis.del(`product:${id}`);
};
```

### Cache warming

```javascript
// Pre-populate cache on startup
const warmCache = async () => {
  const topProducts = await db.query(
    'SELECT * FROM products ORDER BY sales DESC LIMIT 100'
  );

  for (const product of topProducts) {
    await redis.set(
      `product:${product.id}`,
      JSON.stringify(product),
      { EX: 3600 }
    );
  }
};
```

---

## Performance Monitoring

### Metrics to Track

| Metric | Target | Alert Threshold |
|--------|--------|-----------------|
| Response Time | <100ms | >200ms |
| Error Rate | <1% | >5% |
| CPU Usage | <70% | >85% |
| Memory Usage | <80% | >90% |
| DB Connections | <80% pool | >90% pool |
| Cache Hit Rate | >80% | <60% |

### Monitoring Tools

```javascript
// Prometheus metrics
const promClient = require('prom-client');

const httpRequestDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests',
  labelNames: ['method', 'route', 'status']
});

// Middleware
app.use((req, res, next) => {
  const end = httpRequestDuration.startTimer();
  res.on('finish', () => {
    end({ method: req.method, route: req.route?.path, status: res.statusCode });
  });
  next();
});
```

### Grafana Dashboard

```yaml
# docker-compose.yml addition
grafana:
  image: grafana/grafana
  ports:
    - "3000:3000"
  environment:
    - GF_SECURITY_ADMIN_PASSWORD=admin

prometheus:
  image: prom/prometheus
  ports:
    - "9090:9090"
  volumes:
    - ./prometheus.yml:/etc/prometheus/prometheus.yml
```

---

## Auto-Scaling

### AWS Auto Scaling

```json
// autoscaling-config.json
{
  "AutoScalingGroupName": "foodzeep-api",
  "MinSize": 2,
  "MaxSize": 10,
  "DesiredCapacity": 3,
  "TargetTrackingScalingPolicies": [
    {
      "MetricName": "CPUUtilization",
      "TargetValue": 70.0
    }
  ]
}
```

### Kubernetes HPA

```yaml
# hpa.yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: foodzeep-api
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: foodzeep-api
  minReplicas: 2
  maxReplicas: 10
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
```

---

## Database Scaling

### Read Replicas

```
Master (Write)
    │
    ├── Replica 1 (Read)
    ├── Replica 2 (Read)
    └── Replica 3 (Read)
```

### Sharding Strategy

```
Shard 1: Users 1-250K
Shard 2: Users 250K-500K
Shard 3: Users 500K-750K
Shard 4: Users 750K-1M
```

### Connection Pooling

```javascript
// Use ProxySQL or PgBouncer
const poolConfig = {
  host: 'proxysql-host',
  port: 6033,  // ProxySQL port
  connectionLimit: 100,
  queueLimit: 50
};
```

---

## Cost Optimization

### Resource Right-Sizing

| Users | Server Size | Database | Cache |
|-------|-------------|----------|-------|
| 1K | t3.small | db.t3.micro | t3.micro |
| 10K | t3.medium | db.t3.small | t3.small |
| 100K | t3.large | db.r5.large | r5.large |
| 1M | m5.xlarge | db.r5.xlarge | r5.xlarge |

### Cost Monitoring

```bash
# AWS CLI
aws ce get-cost-and-usage \
  --time-period Start=2026-07-01,End=2026-07-31 \
  --granularity MONTHLY \
  --metrics "UnblendedCost"
```

---

## Scaling Checklist

### Phase 1 (1K users)

- [ ] Database indexes added
- [ ] Connection pool tuned
- [ ] Response compression enabled
- [ ] Caching headers set

### Phase 2 (10K users)

- [ ] Load balancer configured
- [ ] Multiple server instances
- [ ] Redis caching implemented
- [ ] CDN configured

### Phase 3 (100K users)

- [ ] Read replicas setup
- [ ] Query optimization done
- [ ] Connection pooling proxy
- [ ] Monitoring alerts configured

### Phase 4 (1M users)

- [ ] Services extracted
- [ ] Message queues implemented
- [ ] Service discovery setup
- [ ] Auto-scaling configured
