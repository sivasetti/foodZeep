# Database

## Overview

FoodZeep uses **MySQL 8** with **Knex.js** for schema migrations and **mysql2** for runtime queries. The database follows a normalized relational design with foreign key constraints and proper indexing.

## Connection

```javascript
// backend/src/config/db.js
const pool = mysql.createPool({
  host: config.db.host,
  user: config.db.user,
  password: config.db.password,
  database: config.db.name,
  connectionLimit: 10,
  waitForConnections: true,
  connectTimeout: 10000,
  idleTimeout: 60000
});

module.exports = pool.promise();
```

- Pool limit: **10 connections**
- Promise-based API for async/await usage
- Connection validation on startup

## Schema

### users

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,  -- bcrypt hash
  role ENUM('buyer', 'seller', 'Admin') DEFAULT 'buyer',
  is_blocked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### food_items

```sql
CREATE TABLE food_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  quantity INT NOT NULL DEFAULT 0,
  veg BOOLEAN DEFAULT FALSE,
  image_url VARCHAR(500),
  expiry_time DATETIME NOT NULL,
  seller_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### orders

```sql
CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  status ENUM('PLACED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED') DEFAULT 'PLACED',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### order_items

```sql
CREATE TABLE order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  food_id INT NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (food_id) REFERENCES food_items(id) ON DELETE CASCADE
);
```

### refresh_tokens

```sql
CREATE TABLE refresh_tokens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  token VARCHAR(500) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## Relationships

```
users (1) ──────< (N) food_items
   │                     │
   │ (1)                 │ (1)
   │                     │
   └──────< (N) orders   │
              │          │
              │ (1)      │
              │          │
         order_items >───┘
              │
              └──> food_items (N)

users (1) ──────< (N) refresh_tokens
```

## Migrations

Location: `backend/src/DB/migrations/`

| File | Purpose |
|------|---------|
| `20260520170503_initialize_db.js` | Creates all core tables |
| `20260520182407_add_indices_to_food_items.js` | Adds performance indexes |
| `20260522181411_create_refresh_tokens_table.js` | Adds refresh token storage |

### Commands

```bash
# Check migration status
npx knex migrate:status --knexfile knexfile.js

# Run pending migrations
npx knex migrate:latest --knexfile knexfile.js

# Rollback last batch
npx knex migrate:rollback --knexfile knexfile.js
```

### Migration Pattern

```javascript
// Example: initialize_db.js
exports.up = function(knex) {
  return knex.schema
    .createTable('users', (table) => {
      table.increments('id').primary();
      table.string('email').unique().notNullable();
      // ...
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('order_items')
    .dropTableIfExists('orders')
    .dropTableIfExists('food_items')
    .dropTableIfExists('refresh_tokens')
    .dropTableIfExists('users');
};
```

## Indexes

Performance indexes on frequently queried columns:

| Table | Column | Type | Purpose |
|-------|--------|------|---------|
| food_items | seller_id | B-Tree | Seller's food lookup |
| food_items | expiry_time | B-Tree | Cron cleanup queries |
| orders | user_id | B-Tree | User order history |
| order_items | order_id | B-Tree | Order item lookup |

## Query Patterns

### Direct SQL (Runtime)

Models use raw mysql2 queries for flexibility:

```javascript
// backend/src/modules/food/food.model.js
const db = require('../../config/db');

const getFoodById = async (id) => {
  const [rows] = await db.query(
    'SELECT * FROM food_items WHERE id = ?',
    [id]
  );
  return rows[0];
};

const getFoodBySeller = async (sellerId, page, limit) => {
  const offset = (page - 1) * limit;
  const [rows] = await db.query(
    'SELECT * FROM food_items WHERE seller_id = ? LIMIT ? OFFSET ?',
    [sellerId, limit, offset]
  );
  return rows;
};
```

### Transaction Pattern

```javascript
// backend/src/utils/transaction.js
const { runInTransaction } = require('../utils/transaction');

// Usage in orders.service.js
const placeOrder = async (userId, items, totalAmount) => {
  return await runInTransaction(async (connection) => {
    // 1. Create order
    const [orderResult] = await connection.query(
      'INSERT INTO orders (user_id, total_amount) VALUES (?, ?)',
      [userId, totalAmount]
    );
    const orderId = orderResult.insertId;

    // 2. Create order items
    for (const item of items) {
      await connection.query(
        'INSERT INTO order_items (order_id, food_id, quantity, price) VALUES (?, ?, ?, ?)',
        [orderId, item.food_id, item.quantity, item.price]
      );
    }

    // 3. Update food quantity
    for (const item of items) {
      await connection.query(
        'UPDATE food_items SET quantity = quantity - ? WHERE id = ? AND quantity >= ?',
        [item.quantity, item.food_id, item.quantity]
      );
    }

    return orderId;
  });
};
```

## Seeder

Populate database with test data:

```bash
node src/utils/seeder.js
```

Creates:
- Sample users (buyer, seller, admin)
- Sample food items
- Test orders

## Error Handling

Common MySQL errors caught by `error.middleware.js`:

| Error Code | Meaning | HTTP Status |
|------------|---------|-------------|
| ER_DUP_ENTRY | Duplicate email/unique constraint | 400 |
| ER_NO_REFERENCED_ROW_2 | Foreign key violation | 400 |

## Performance Considerations

- **Connection pooling:** Limits concurrent connections to 10
- **Indexed queries:** B-tree indexes on foreign keys and filter columns
- **Pagination:** Offset-based with LIMIT clause
- **Transaction isolation:** Default MySQL isolation level
- **Query parameterization:** Prevents SQL injection

## Future Optimizations

- Read replicas for scaling
- Query caching with Redis
- Connection pooling tuning
- Query performance monitoring
- Slow query logging
