# Architecture

## System Overview

FoodZeep follows a **Modular Monolith** architecture. All backend modules live in a single Express application, with clear domain boundaries that allow future extraction into microservices if needed.

```
┌─────────────────────────────────────────────────────────┐
│                    React Frontend                        │
│                    (localhost:3000)                       │
└───────────────────────┬─────────────────────────────────┘
                        │ HTTP / REST
                        ▼
┌─────────────────────────────────────────────────────────┐
│                  Express.js Backend                      │
│                   (localhost:5000)                        │
├─────────────────────────────────────────────────────────┤
│  Rate Limiter → Helmet → CORS → Cookie Parser           │
│         ↓                                               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │  Auth     │  │  Food    │  │  Orders  │  ← Modules  │
│  │  Module   │  │  Module  │  │  Module  │             │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘             │
│       │              │              │                    │
│  ┌────┴──────────────┴──────────────┴─────┐            │
│  │        Controllers → Services → Models  │            │
│  └────────────────┬───────────────────────┘            │
│                   │                                     │
│  ┌────────────────┴───────────────────────┐            │
│  │     MySQL2 Connection Pool (10)        │            │
│  └────────────────┬───────────────────────┘            │
└───────────────────┼─────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────┐
│                    MySQL 8 Database                      │
│                                                          │
│  Tables: users, food_items, orders, order_items,         │
│          refresh_tokens                                  │
└─────────────────────────────────────────────────────────┘
```

## Request Flow

```
Client Request
      │
      ▼
Rate Limiter (100 req/15min on /api)
      │
      ▼
Global Middleware (helmet, cors, cookie-parser, morgan)
      │
      ▼
Route Handler
      │
      ▼
Validation Middleware (Joi schema)
      │
      ▼
Auth Middleware (JWT verify → req.user)
      │
      ▼
Role Middleware (authorize roles)
      │
      ▼
Controller (parse request, call service)
      │
      ▼
Service (business logic, transactions)
      │
      ▼
Model (database queries via mysql2 pool)
      │
      ▼
MySQL Database
      │
      ▼
Structured JSON Response
```

## Module Structure

```
backend/src/
├── server.js              # Entry point: starts HTTP server, registers shutdown handlers
├── app.js                 # Express setup, middleware stack, route mounting
│
├── config/
│   ├── config.service.js  # Env var validation (halts if missing)
│   ├── db.js              # mysql2 connection pool
│   ├── logger.js          # Winston logger config
│   ├── multer.js          # File upload config
│   └── swagger.js         # OpenAPI/Swagger setup
│
├── middlewares/
│   ├── auth.middleware.js      # protect() + authorize(...roles)
│   ├── validation.middleware.js # Joi schema validation wrapper
│   └── error.middleware.js     # Centralized error translation
│
├── modules/
│   ├── auth/
│   │   ├── auth.routes.js      # POST /register, POST /login
│   │   ├── auth.controller.js
│   │   ├── auth.service.js
│   │   └── auth.model.js
│   ├── food/
│   │   ├── food.routes.js      # CRUD + file upload
│   │   ├── food.controller.js
│   │   ├── food.service.js
│   │   └── food.model.js
│   └── orders/
│       ├── orders.routes.js    # Checkout, status updates
│       ├── orders.controller.js
│       ├── orders.service.js
│       └── orders.model.js
│
├── validators/
│   ├── auth.validator.js
│   ├── food.validator.js
│   └── orders.validator.js
│
├── utils/
│   ├── transaction.js    # runInTransaction(workFn)
│   ├── cron.js           # Background scheduled tasks
│   └── seeder.js         # Database seeding
│
└── DB/
    └── migrations/       # Knex migration files
```

## Layer Responsibilities

| Layer | Responsibility | Example |
|-------|---------------|---------|
| Routes | Define endpoints, mount middleware, Swagger annotations | `auth.routes.js` |
| Controller | Parse request, call service, format response | `food.controller.js` |
| Service | Business logic, transactions, validation rules | `orders.service.js` |
| Model | Database queries, table interactions | `food.model.js` |
| Middleware | Cross-cutting concerns (auth, validation, errors) | `auth.middleware.js` |

## Database Schema

```
users
  ├── id (PK)
  ├── name
  ├── email (unique)
  ├── password (bcrypt hash)
  ├── role (buyer | seller | Admin)
  ├── is_blocked (boolean)
  ├── created_at
  └── updated_at

food_items
  ├── id (PK)
  ├── name
  ├── price
  ├── quantity
  ├── veg (boolean)
  ├── image_url
  ├── expiry_time
  ├── seller_id (FK → users.id)
  ├── created_at
  └── updated_at

orders
  ├── id (PK)
  ├── user_id (FK → users.id)
  ├── total_amount
  ├── status (PLACED | PREPARING | OUT_FOR_DELIVERY | DELIVERED | CANCELLED)
  ├── created_at
  └── updated_at

order_items
  ├── id (PK)
  ├── order_id (FK → orders.id)
  ├── food_id (FK → food_items.id)
  ├── quantity
  └── price

refresh_tokens
  ├── id (PK)
  ├── user_id (FK → users.id)
  ├── token
  ├── expires_at
  └── created_at
```

## Security Layers

| Layer | Implementation |
|-------|---------------|
| HTTP Headers | Helmet.js |
| Rate Limiting | express-rate-limit (100 req/15min) |
| CORS | cors middleware |
| Authentication | JWT (Bearer token in Authorization header) |
| Authorization | Role-based (buyer, seller, Admin) |
| Password | bcrypt hashing |
| Input Validation | Joi schemas |
| Error Handling | Centralized error.middleware.js |
| SQL Safety | Parameterized queries via mysql2 |
| Body Size | 10KB limit on JSON payloads |

## Transactions

Multi-query operations use `runInTransaction()` from `src/utils/transaction.js`:

```javascript
const { runInTransaction } = require('../utils/transaction');

await runInTransaction(async (connection) => {
  await connection.query('INSERT INTO orders ...');
  await connection.query('INSERT INTO order_items ...');
  // Auto-commits on success, auto-rollbacks on error
});
```

## Key Files

| File | Purpose |
|------|---------|
| `backend/server.js` | HTTP server startup, graceful shutdown handlers |
| `backend/src/app.js` | Express middleware stack, route mounting |
| `backend/src/config/config.service.js` | Environment variable validation |
| `backend/src/config/db.js` | MySQL connection pool (limit: 10) |
| `backend/knexfile.js` | Knex migration configuration |

## Graceful Shutdown

On `SIGTERM` / `SIGINT`:
1. Stop accepting new HTTP requests
2. Wait for active transactions to complete
3. Close MySQL connection pool
4. Force exit after 10-second timeout if stuck
