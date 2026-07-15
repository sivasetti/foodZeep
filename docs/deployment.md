# Deployment Guide

## Overview

FoodZeep deployment guide covering development, staging, and production environments.

---

## Prerequisites

### Software Requirements

| Software | Version | Purpose |
|----------|---------|---------|
| Node.js | 24+ | Runtime |
| MySQL | 8+ | Database |
| npm | Latest | Package manager |
| Git | Latest | Version control |

### Environment Variables

Required in `backend/.env`:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=foodzeep_db

# Authentication
JWT_SECRET=your_super_secret_key

# File Uploads
UPLOAD_PATH=uploads
```

---

## Local Development

### 1. Clone and Setup

```bash
git clone https://github.com/sivasetti/FoodZeep.git
cd FoodZeep/backend
npm install
```

### 2. Database Setup

```bash
# Create database
mysql -u root -p
CREATE DATABASE foodzeep_db;
EXIT;

# Run migrations
npm run db:migrate

# Seed data (optional)
node src/utils/seeder.js
```

### 3. Start Server

```bash
# Development (auto-reload)
npm run dev

# Production
npm start
```

### 4. Verify

- API: http://localhost:5000
- Swagger: http://localhost:5000/api-docs

---

## Docker Deployment

### Dockerfile

```dockerfile
# backend/Dockerfile
FROM node:24-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

CMD ["node", "server.js"]
```

### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  api:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - PORT=5000
      - DB_HOST=mysql
      - DB_USER=root
      - DB_PASSWORD=${DB_PASSWORD}
      - DB_NAME=foodzeep_db
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - mysql
    restart: unless-stopped

  mysql:
    image: mysql:8
    environment:
      - MYSQL_ROOT_PASSWORD=${DB_PASSWORD}
      - MYSQL_DATABASE=foodzeep_db
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./frontend/build:/usr/share/nginx/html
    depends_on:
      - api
    restart: unless-stopped

volumes:
  mysql_data:
```

### Build and Run

```bash
# Build images
docker-compose build

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f api

# Stop services
docker-compose down
```

---

## Production Deployment

### Environment Setup

1. **Server Requirements:**
   - Ubuntu 22.04 LTS or similar
   - 2GB+ RAM
   - 20GB+ storage
   - Node.js 24+
   - MySQL 8+

2. **Security:**
   - SSH key authentication
   - Firewall configured (UFW)
   - SSL certificates (Let's Encrypt)
   - Non-root user for app

### Step-by-Step

#### 1. Server Preparation

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 24
curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -
sudo apt install -y nodejs

# Install MySQL
sudo apt install mysql-server -y
sudo mysql_secure_installation

# Create database
sudo mysql -u root -p
CREATE DATABASE foodzeep_db;
CREATE USER 'foodzeep'@'localhost' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON foodzeep_db.* TO 'foodzeep'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

#### 2. Deploy Application

```bash
# Clone repository
cd /var/www
sudo git clone https://github.com/sivasetti/FoodZeep.git
sudo chown -R $USER:$USER FoodZeep

# Install dependencies
cd FoodZeep/backend
npm install --production

# Configure environment
cp .env.example .env
nano .env  # Add production values

# Run migrations
npm run db:migrate
```

#### 3. Process Manager (PM2)

```bash
# Install PM2
sudo npm install -g pm2

# Start application
pm2 start server.js --name foodzeep-api

# Setup startup script
pm2 startup
pm2 save

# Monitor
pm2 monit
pm2 logs foodzeep-api
```

#### 4. Nginx Reverse Proxy

```nginx
# /etc/nginx/sites-available/foodzeep
server {
    listen 80;
    server_name api.foodzeep.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location /uploads {
        alias /var/www/FoodZeep/backend/uploads;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/foodzeep /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### 5. SSL Certificate

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get certificate
sudo certbot --nginx -d api.foodzeep.com

# Auto-renewal
sudo certbot renew --dry-run
```

---

## CI/CD Pipeline

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '24'
      - run: cd backend && npm ci
      - run: cd backend && npm test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to server
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /var/www/FoodZeep
            git pull origin main
            cd backend
            npm ci --production
            npm run db:migrate
            pm2 restart foodzeep-api
```

---

## Monitoring

### Health Check Endpoint

```javascript
// Add to backend/src/app.js
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});
```

### PM2 Monitoring

```bash
# Real-time monitoring
pm2 monit

# View logs
pm2 logs foodzeep-api --lines 100

# Restart
pm2 restart foodzeep-api

# Status
pm2 status
```

### Application Logs

Logs stored in `backend/logs/`:
- `app.log` - Application logs
- `error.log` - Error logs
- `combined.log` - All logs

---

## Backup Strategy

### Database Backup

```bash
# Manual backup
mysqldump -u root -p foodzeep_db > backup_$(date +%Y%m%d).sql

# Automated daily backup (crontab)
0 2 * * * mysqldump -u root -p foodzeep_db | gzip > /backups/foodzeep_$(date +\%Y\%m\%d).sql.gz
```

### Restore

```bash
# Restore from backup
mysql -u root -p foodzeep_db < backup_20260714.sql
```

---

## Rollback Procedure

### Application Rollback

```bash
# Using Git
git log --oneline -10
git checkout <previous-commit>
pm2 restart foodzeep-api
```

### Database Rollback

```bash
# Knex rollback
npm run db:rollback

# Or restore from backup
mysql -u root -p foodzeep_db < backup.sql
```

---

## Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| Port 5000 in use | `lsof -i :5000` then kill process |
| Database connection refused | Check MySQL service: `sudo systemctl status mysql` |
| Permission denied | Check file permissions: `chmod -R 755 uploads` |
| JWT error | Verify JWT_SECRET in .env |
| Migration failed | Check migration order, rollback and retry |

### Debug Mode

```bash
# Enable debug logging
NODE_DEBUG=app pm2 restart foodzeep-api

# View detailed logs
pm2 logs foodzeep-api --debug
```

---

## Security Checklist

- [ ] Environment variables secured
- [ ] JWT secret is strong and unique
- [ ] Database credentials rotated
- [ ] HTTPS enabled
- [ ] Firewall configured
- [ ] Rate limiting active
- [ ] CORS properly configured
- [ ] File upload restrictions in place
- [ ] SQL injection prevention verified
- [ ] XSS protection enabled (helmet)
