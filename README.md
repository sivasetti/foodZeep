# 🍔 foodZeep Backend API

A production-grade RESTful food delivery API built with **Node.js**, **Express.js**, and **MySQL**. Supports user registration, JWT authentication, food item management, image uploads, order placement, pagination, transactional order processing, and role-based authorization for customers, sellers, and admins. :contentReference[oaicite:0]{index=0}

[![Run in Postman](https://run.pstmn.io/button.svg)](YOUR_POSTMAN_COLLECTION_LINK)

---

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js 5
- **Database:** MySQL (`mysql2`)
- **Authentication:** JWT (JSON Web Tokens)
- **Password Security:** bcrypt
- **Security:** helmet, cors, express-rate-limit, xss-clean
- **File Uploads:** multer
- **Logging:** Winston + Morgan
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

### 2. Install dependencies

```bash
npm install
```

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

### 4. Seed the database

Populate the database with sample users and food items.

```bash
node src/utils/seeder.js
```

### 5. Run the project

```bash
# Development
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
├── server.js                     # Entry point
├── app.js                        # Express setup, middleware, routes

├── config/
│   ├── db.js                     # MySQL connection pool
│   ├── logger.js                 # Winston logger configuration
│   └── swagger.js                # Swagger API documentation setup

├── middlewares/
│   ├── auth.middleware.js        # JWT authentication middleware
│   └── error.middleware.js       # Global error handling middleware

├── utils/
│   ├── transaction.js            # Reusable DB transaction wrapper
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

- **JWT Token** — used for user authentication
- **Protected Routes** — accessible only with valid tokens
- **Role-Based Access** — Customer, Seller, and Admin permissions

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

## 🔒 Security Features

- Passwords hashed with **bcrypt**
- JWT-based authentication
- Request sanitization using **xss-clean**
- HTTP headers secured with **helmet**
- Rate limiting — max **100 requests / 15 minutes**
- Role-based authorization middleware
- Centralized global error handling
- Atomic database transactions for order processing
- Secure CORS configuration

---

## ⚡ Performance Optimizations

- MySQL connection pooling
- Indexed database queries
- Offset-based pagination
- Transaction wrapper utility for atomic writes
- Structured production-grade logging

---

## 📚 Swagger API Documentation

Swagger UI documentation available at:

```bash
http://localhost:5000/api-docs
```

---

## 🛑 Graceful Shutdown Handling

The application safely handles shutdown signals (`SIGINT`, `SIGTERM`) by:

- Stopping new incoming requests
- Completing active database transactions
- Closing MySQL connection pools safely
- Preventing data corruption during crashes or deployments

---

## 👨‍💻 Author

Built by **Siva Setti** using scalable backend engineering practices and production-grade Node.js architecture.