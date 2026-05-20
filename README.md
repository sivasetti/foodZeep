# 🍔 foodZeep Backend API

A production-grade RESTful food delivery API built with **Node.js**, **Express.js**, and **MySQL**. Supports user registration, JWT authentication, food item management, image uploads, order placement, pagination, transactional order processing, automated background sweeps, schema migrations, observability logging, and role-based authorization for customers, sellers, and admins. :contentReference[oaicite:0]{index=0}

[![Run in Postman](https://run.pstmn.io/button.svg)](https://github.com/sivasetti/foodZeep/tree/main/postman/collections/Orders)

---

## 🛠️ Tech Stack

- **Runtime:** Node.js (v24+)
- **Framework:** Express.js 5
- **Database Engine:** MySQL (`mysql2`)
- **Schema Management & Version Control:** Knex.js
- **Background Task Scheduling:** Node-Cron
- **Authentication:** JWT (JSON Web Tokens)
- **Password Security:** bcrypt
- **Security:** helmet, cors, express-rate-limit, xss-clean
- **File Uploads:** multer
- **Logging & Observability:** Winston + Morgan
- **API Documentation:** Swagger UI (OpenAPI 3.0)

---

## ✅ Prerequisites

- [Node.js](https://nodejs.org/) v24+
- [MySQL](https://www.mysql.com/) v8+
- npm

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd foodZeep/backend
```

---

### 2. Install dependencies

```bash
npm install
```

---

### 3. Set up environment variables

Create a `.env` file inside the backend root directory.

```env
PORT=5000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=foodzeep_db

JWT_SECRET=your_super_secret_key

NODE_ENV=development
```

---

### 4. Database Baseline & Migrations

Instead of manual SQL imports, foodZeep uses **Knex.js** to automatically construct, version, and scale the database schema.

```bash
# Verify migration synchronization status
npx knex migrate:status --knexfile knexfile.js

# Apply latest schema migrations
npx knex migrate:latest --knexfile knexfile.js
```

---

### 5. Seed the database

Populate the database with sample users and food items.

```bash
node src/utils/seeder.js
```

---

### 6. Run the project

```bash
# Development (nodemon auto reload)
npm run dev

# Production
npm start
```

---

## 🔐 Environment Variables

| Variable | Description | Example |
|----------|-------------|----------|
| `PORT` | Port the server runs on | `5000` |
| `DB_HOST` | MySQL database host | `localhost` |
| `DB_USER` | MySQL username | `root` |
| `DB_PASSWORD` | MySQL password | `your_password` |
| `DB_NAME` | Database name | `foodzeep_db` |
| `JWT_SECRET` | Secret key for JWT signing | `super_secret_key` |
| `NODE_ENV` | Runtime environment | `development` |

> ⚠️ Never commit your real `.env` files to version control.

---

## 📁 Project Structure

```plaintext
src/
├── server.js                     # Entry point (listeners & lifecycle guards)
├── app.js                        # Express setup, middleware, routes
├── knexfile.js                   # Knex schema configuration

├── config/
│   ├── db.js                     # Managed MySQL connection pool
│   ├── logger.js                 # Winston structured logger
│   └── swagger.js                # Swagger API documentation setup

├── DB/
│   └── migrations/               # Knex migration blueprints
│       └── 20260520170503_initialize_db.js

├── middlewares/
│   ├── auth.middleware.js        # JWT authentication middleware
│   └── errorHandler.js           # Centralized error translation middleware

├── utils/
│   ├── transaction.js            # Reusable transactional wrapper
│   ├── cron.js                   # Automated cron cleanup workers
│   └── seeder.js                 # Database seeder script

└── modules/
    ├── auth/
    │   ├── auth.controller.js
    │   ├── auth.service.js
    │   ├── auth.model.js
    │   └── auth.routes.js

    ├── food/
    │   ├── food.controller.js
    │   ├── food.service.js
    │   ├── food.model.js
    │   └── food.routes.js

    ├── orders/
    │   ├── orders.controller.js
    │   ├── orders.service.js
    │   ├── orders.model.js
    │   └── orders.routes.js

    └── users/
        ├── users.controller.js
        ├── users.service.js
        ├── users.model.js
        └── users.routes.js
```

---

## 📡 API Endpoints

### Authentication — `/api/auth`

| Method | Endpoint | Description | Auth |
|--------|-----------|-------------|------|
| POST | `/api/auth/register` | Register a new user | ❌ |
| POST | `/api/auth/login` | Login & receive JWT token | ❌ |

---

### Users — `/api/users`

| Method | Endpoint | Description | Auth |
|--------|-----------|-------------|------|
| GET | `/api/users/profile` | Get logged-in user profile | ✅ |
| PATCH | `/api/users/profile` | Update user profile | ✅ |
| PATCH | `/api/users/password` | Change password | ✅ |
| DELETE | `/api/users/profile` | Delete user account | ✅ |

---

### Food — `/api/food`

| Method | Endpoint | Description | Auth |
|--------|-----------|-------------|------|
| POST | `/api/food` | Upload a food item with image | ✅ Seller Only |
| GET | `/api/food` | Get all available food items | ❌ |
| GET | `/api/food/:id` | Get single food item details | ❌ |
| PATCH | `/api/food/:id` | Update food item | ✅ Seller Only |
| DELETE | `/api/food/:id` | Delete food item | ✅ Seller Only |

### Query params for `/api/food`

```bash
?page=1&limit=10
```

---

### Orders — `/api/orders`

| Method | Endpoint | Description | Auth |
|--------|-----------|-------------|------|
| POST | `/api/orders` | Place an order | ✅ Customer Only |
| GET | `/api/orders/my` | Get logged-in user's orders | ✅ |
| GET | `/api/orders/:id` | Get single order details | ✅ |
| PATCH | `/api/orders/:id/status` | Update order status | ✅ Seller/Admin |
| DELETE | `/api/orders/:id` | Cancel an order | ✅ |

### Query params for `/api/orders/my`

```bash
?page=1&limit=10
```

---

### Admin — `/api/admin` 🔒

> All admin routes require `role: admin`

| Method | Endpoint | Description |
|--------|-----------|-------------|
| GET | `/api/admin/users` | Get all users |
| GET | `/api/admin/orders` | Get all orders |
| GET | `/api/admin/foods` | Get all food items |
| PATCH | `/api/admin/users/:id/block` | Block a user |
| PATCH | `/api/admin/users/:id/unblock` | Unblock a user |
| DELETE | `/api/admin/users/:id` | Delete a user |

---

## 🔑 Authentication

All protected routes require a JWT access token in the `Authorization` header:

```bash
Authorization: Bearer <your_access_token>
```

You get the token from `/api/auth/login`.

### Token Strategy

- **JWT Token** — secure stateless authentication
- **Protected Routes** — accessible only with valid tokens
- **Role-Based Authorization** — Customer, Seller, and Admin permissions

---

## 📝 Request Examples

### Register

```json
POST /api/auth/register

{
  "name": "Siva Setti",
  "email": "siva@example.com",
  "password": "SecurePassword123",
  "role": "customer"
}
```

---

### Login

```json
POST /api/auth/login

{
  "email": "siva@example.com",
  "password": "SecurePassword123"
}
```

---

### Upload Food Item

```http
POST /api/food
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

| Field | Type | Example |
|------|------|----------|
| `name` | Text | Chicken Biryani |
| `price` | Text | 350 |
| `quantity` | Text | 20 |
| `veg` | Text | 0 |
| `expiry_time` | Text | 2026-06-01 23:59:59 |
| `image` | File | biryani.jpg |

---

### Place Order

```json
POST /api/orders

{
  "total_amount": 700,
  "items": [
    {
      "food_id": 1,
      "quantity": 2,
      "price": 350
    }
  ]
}
```

---

## 🔒 Security Features & Integrity Guards

- Password hashing using **bcrypt**
- JWT-based authentication & authorization
- Request sanitization using **xss-clean**
- HTTP header hardening using **helmet**
- Rate limiting — max **100 requests / 15 minutes**
- Secure CORS configuration
- Centralized REST error translation middleware
- Atomic transactional order processing
- Constraint-relaxed migration handling using `FOREIGN_KEY_CHECKS`

---

## ⚡ Performance Optimizations

- High-throughput **MySQL connection pooling**
- Optimized **B-Tree indexing** for high-frequency queries
- Offset-based pagination
- Reusable higher-order transaction wrapper
- Automated background janitor cron engine
- Structured observability logging

---

## 📊 Observability & System Logging

Winston-based structured logging captures request context and application errors:

```json
{
  "message": "Duplicate email already registered.",
  "statusCode": 400,
  "path": "/api/auth/register",
  "method": "POST",
  "ip": "127.0.0.1"
}
```

---

## 🛑 Graceful Shutdown Handling

The application securely monitors process termination signals (`SIGINT`, `SIGTERM`) to:

- Stop accepting new requests
- Allow active transactions to complete safely
- Drain and close MySQL connection pools
- Prevent runtime data corruption during deployments

---

## 📚 Swagger API Documentation

Swagger UI documentation available at:

```bash
http://localhost:5000/api-docs
```

---

## 👨‍💻 Author

Built by **Siva Setti** using scalable backend engineering practices, clean architectural layering, and production-ready Node.js design patterns.