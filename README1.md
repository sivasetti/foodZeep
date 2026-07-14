# 🍔 FoodZeep

<div align="center">

### Engineering a Food Delivery Platform from MVP to Production

*A modern full-stack food ordering platform built with production-oriented software engineering practices.*

<p>

![Node.js](https://img.shields.io/badge/Node.js-24.x-339933?logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-5-black?logo=express)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![MySQL](https://img.shields.io/badge/MySQL-8-4479A1?logo=mysql&logoColor=white)
![Knex.js](https://img.shields.io/badge/Knex.js-Query%20Builder-D26B38)
![JWT](https://img.shields.io/badge/Auth-JWT-blue)
![Swagger](https://img.shields.io/badge/API-Swagger-85EA2D?logo=swagger)
![License](https://img.shields.io/badge/License-MIT-green)

</p>

</div>

---

# 📖 Overview

FoodZeep is an end-to-end full-stack food ordering platform built to learn, apply, and demonstrate modern software engineering practices through the development of a real product.

Rather than being another CRUD application, FoodZeep focuses on solving real engineering problems encountered while building scalable backend systems.

The project is intentionally developed in stages, allowing the architecture to evolve naturally as new product requirements emerge. Instead of introducing complex technologies from the beginning, every engineering decision is driven by a practical need.

The long-term vision is to evolve FoodZeep from a Minimum Viable Product (MVP) into a production-ready platform while documenting every architectural and engineering decision throughout the journey.

---

# 🎯 Project Vision

FoodZeep is built around three primary goals:

- Build a production-quality full-stack application.
- Learn software engineering through real product development.
- Create a portfolio project that demonstrates backend, frontend, database, and system design skills expected from Software Development Engineers (SDEs).

---

# 🚀 Development Status

## Current Stage

🟢 **MVP Development**

### Backend

- ✅ Authentication & Authorization
- ✅ User Management
- ✅ Food Management
- ✅ Order Management
- ✅ JWT Authentication
- ✅ Password Hashing
- ✅ Transactional Order Processing
- ✅ Database Migrations
- ✅ Swagger API Documentation
- ✅ Structured Logging
- ✅ Global Error Handling
- ✅ File Uploads
- ✅ Pagination
- ✅ Background Cron Jobs

### Frontend

- 🚧 Authentication UI
- 🚧 Food Listing
- 🚧 Product Details
- 🚧 Shopping Cart
- 🚧 Checkout
- 🚧 Order Tracking
- 🚧 User Dashboard

---

# 🎯 Project Goals

FoodZeep is designed with the following engineering goals:

- Clean Architecture
- Modular Design
- Secure REST APIs
- Maintainable Codebase
- Production-Oriented Development
- Scalable System Design
- Continuous Learning Through Real Product Development

---

# ✨ Features

## 🔐 Authentication

- User Registration
- Secure Login
- JWT Authentication
- Password Hashing with bcrypt
- Role-Based Authorization

---

## 👤 User Management

- User Profile
- Update Profile
- Change Password
- Delete Account

---

## 🍽️ Food Management

- Create Food Items
- Update Food Items
- Delete Food Items
- Food Image Uploads
- Pagination
- Search & Filtering

---

## 📦 Order Management

- Place Orders
- View Order History
- Update Order Status
- Cancel Orders
- Transactional Checkout

---

## ⚙️ Engineering Features

- Feature-Based Modular Architecture
- RESTful API Design
- Knex Database Migrations
- Swagger API Documentation
- Winston Structured Logging
- Global Error Handling
- Background Cron Jobs
- Graceful Shutdown
- MySQL Connection Pooling
- Rate Limiting
- Secure HTTP Headers
- Input Sanitization

---

# 🧠 Engineering Philosophy

Every technology inside FoodZeep exists because it solves a real engineering problem.

Instead of introducing advanced technologies prematurely, the application evolves naturally as product requirements grow.

This approach mirrors how software is developed in modern startups and product-based companies.

Examples:

| Engineering Problem | Solution Introduced |
|---------------------|--------------------|
| Secure Authentication | JWT + bcrypt |
| Reliable Checkout | Database Transactions |
| Background Automation | Cron Jobs |
| API Documentation | Swagger |
| Application Logging | Winston |
| Faster Queries | Database Indexing *(planned)* |
| Performance | Redis *(planned)* |
| Scalability | Distributed Architecture *(future)* |

---

# 📈 Product Evolution

```text
        MVP
         │
         ▼
    Beta Release
         │
         ▼
 Production Ready
         │
         ▼
 High Availability
         │
         ▼
 Scalable Architecture
         │
         ▼
 Cloud Deployment
         │
         ▼
 Continuous Delivery
```

---

# 📸 Screenshots

> Screenshots will be added as the frontend development progresses.

### Home Page

Coming Soon

### Food Listing

Coming Soon

### Checkout

Coming Soon

### Order History

Coming Soon

---

# 🌐 Live Demo

| Service | Status |
|----------|--------|
| Frontend | 🚧 Under Development |
| Backend API | 🚧 Local Development |
| Swagger Documentation | ✅ Available Locally |
| Deployment | 🚧 Planned |
---

# 🏗️ System Architecture

FoodZeep follows a **Modular Monolith Architecture**, where related functionalities are organized into independent feature modules while remaining within a single deployable application.

This architecture provides an excellent balance between development speed, maintainability, and scalability for an MVP.

As the application grows, individual modules can be extracted into microservices without significant code restructuring.

---

## High-Level Architecture

```text
                         React Frontend
                               │
                               │
                     HTTP / REST API
                               │
                               ▼
                      Express.js Backend
                               │
 ┌──────────────┬──────────────┬──────────────┐
 │              │              │              │
 │ Authentication│ Validation  │ Business Logic│
 │  Middleware   │ Middleware  │   Services    │
 │              │              │              │
 └──────────────┴──────────────┴──────────────┘
                               │
                      Data Access Layer
                               │
                        MySQL Database
                               │
                   Knex Migrations & Seeds

────────────────────────────────────────────────────

Cross-Cutting Components

• JWT Authentication
• Winston Logging
• Swagger Documentation
• Global Error Handling
• Cron Jobs
• Rate Limiting
• Helmet
• CORS
```

---

# 🏛️ Architecture Style

FoodZeep intentionally follows a **Modular Monolith** architecture.

Instead of introducing microservices prematurely, each business domain is isolated into its own module.

Current modules include:

- Authentication
- Users
- Food
- Orders

This provides:

- Faster development
- Easier debugging
- Simpler deployment
- Lower infrastructure costs
- Better maintainability

As the application grows, these modules can evolve into independently deployable services if required.

---

# 📦 Repository Structure

```text
foodZeep/
│
├── backend/
│   │
│   ├── src/
│   │   │
│   │   ├── config/
│   │   │      ├── db.js
│   │   │      ├── logger.js
│   │   │      └── swagger.js
│   │   │
│   │   ├── DB/
│   │   │      └── migrations/
│   │   │
│   │   ├── middlewares/
│   │   │
│   │   ├── modules/
│   │   │      ├── auth/
│   │   │      ├── users/
│   │   │      ├── food/
│   │   │      └── orders/
│   │   │
│   │   ├── utils/
│   │   ├── validators/
│   │   ├── app.js
│   │   └── server.js
│   │
│   ├── uploads/
│   ├── logs/
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── styles/
│   │   └── utils/
│   └── package.json
│
├── postman/
│   ├── collections/
│   └── environments/
│
├── README.md
└── .gitignore
```

---

# 🛠️ Technology Stack

| Category | Technologies |
|-----------|--------------|
| Frontend | React.js, React Router, Axios |
| Backend | Node.js, Express.js |
| Database | MySQL 8 |
| Query Builder | Knex.js |
| Authentication | JWT, bcrypt |
| Validation | Joi |
| File Upload | Multer |
| API Documentation | Swagger (OpenAPI 3.0) |
| Logging | Winston, Morgan |
| Scheduling | Node Cron |
| Security | Helmet, CORS, Rate Limiting, XSS Protection |
| API Testing | Postman |
| Version Control | Git & GitHub |
| Package Manager | npm |

---

# ⚙️ Engineering Principles

FoodZeep is developed around a small set of engineering principles that guide every architectural decision.

- Separation of Concerns
- Layered Architecture
- Feature-Based Modular Design
- Clean Code
- Reusable Services
- Secure by Default
- API Consistency
- Transaction First
- Production-Oriented Logging
- Incremental Scalability
- DRY (Don't Repeat Yourself)
- KISS (Keep It Simple)
- YAGNI (You Aren't Gonna Need It)

---

# 📂 Core Modules

| Module | Responsibility |
|----------|---------------|
| Authentication | User registration, login, JWT generation and authorization |
| Users | User profile management and account operations |
| Food | Food catalog, CRUD operations, image uploads, filtering and pagination |
| Orders | Transactional order placement, order history and status updates |
| Infrastructure | Database configuration, logging, migrations and shared utilities |
| Scheduler | Automated background maintenance tasks |
| Middleware | Authentication, authorization and centralized error handling |

---

# 💡 Engineering Decisions

FoodZeep intentionally avoids introducing unnecessary complexity.

Every technology is adopted only when it solves a real engineering problem.

For example:

| Problem | Solution |
|----------|----------|
| Secure Authentication | JWT + bcrypt |
| Reliable Checkout | Database Transactions |
| API Discoverability | Swagger |
| Schema Versioning | Knex Migrations |
| Background Automation | Cron Jobs |
| Structured Logging | Winston |
| SQL Performance | Database Indexes *(planned)* |
| High Read Performance | Redis *(planned)* |
| Massive Scale | Microservices *(future)* |

---

# ❓Why These Technologies?

## Why Express instead of NestJS?

Express provides complete flexibility over project architecture and helps build a strong understanding of backend fundamentals before adopting opinionated frameworks.

---

## Why MySQL?

Food ordering systems require strong transactional guarantees to maintain consistency during checkout, inventory updates and order processing.

---

## Why Knex?

Knex provides database version control through migrations while keeping SQL explicit and easy to understand.

---

## Why JWT?

JWT enables stateless authentication, making REST APIs scalable without requiring server-side session storage.

---

## Why a Modular Monolith?

A Modular Monolith minimizes operational complexity during the MVP stage while keeping the application ready for future service extraction if scaling demands it.
---

# 🚀 Getting Started

This guide will help you set up FoodZeep locally for development.

## Prerequisites

Before getting started, ensure you have the following installed:

| Software | Version |
|-----------|---------|
| Node.js | 24.x or later |
| npm | Latest |
| MySQL | 8.x |
| Git | Latest |

---

# 📥 Installation

## 1. Clone the Repository

```bash
git clone https://github.com/sivasetti/FoodZeep.git

cd FoodZeep
```

---

## 2. Install Dependencies

### Backend

```bash
cd backend

npm install
```

### Frontend

```bash
cd ../frontend

npm install
```

---

# ⚙️ Environment Variables

Create a `.env` file inside the **backend** directory.

```env
PORT=5000

NODE_ENV=development

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=foodzeep_db

JWT_SECRET=your_super_secret_key

UPLOAD_PATH=uploads
```

> Never commit your `.env` file to version control.

---

# 🗄️ Database Setup

FoodZeep uses **Knex.js** to manage database schema through version-controlled migrations.

## Check Migration Status

```bash
npx knex migrate:status
```

---

## Run Migrations

```bash
npx knex migrate:latest
```

---

## Rollback Last Migration

```bash
npx knex migrate:rollback
```

---

# 🌱 Seed Database

Populate the database with sample users and food items.

```bash
node src/utils/seeder.js
```

---

# ▶️ Running the Application

## Backend

```bash
npm run dev
```

Backend runs at:

```
http://localhost:5000
```

---

## Frontend

```bash
npm start
```

Frontend runs at:

```
http://localhost:3000
```

---

# 📚 API Documentation

Interactive Swagger documentation is available at:

```
http://localhost:5000/api-docs
```

Swagger provides:

- API Endpoints
- Request Bodies
- Response Schemas
- Authentication Requirements
- Interactive API Testing

---

# 🔐 Authentication

FoodZeep uses **JWT (JSON Web Tokens)** for stateless authentication.

Protected endpoints require the following header:

```http
Authorization: Bearer <access_token>
```

Authentication Flow

```text
Register
      │
      ▼
Login
      │
      ▼
Generate JWT
      │
      ▼
Client Stores Token
      │
      ▼
Authenticated API Requests
```

---

# 📡 API Overview

## Authentication

| Method | Endpoint | Access |
|----------|----------|--------|
| POST | /api/auth/register | Public |
| POST | /api/auth/login | Public |

---

## Users

| Method | Endpoint | Access |
|----------|----------|--------|
| GET | /api/users/profile | Authenticated |
| PATCH | /api/users/profile | Authenticated |
| PATCH | /api/users/password | Authenticated |
| DELETE | /api/users/profile | Authenticated |

---

## Food

| Method | Endpoint | Access |
|----------|----------|--------|
| GET | /api/food | Public |
| GET | /api/food/:id | Public |
| POST | /api/food | Seller |
| PATCH | /api/food/:id | Seller |
| DELETE | /api/food/:id | Seller |

---

## Orders

| Method | Endpoint | Access |
|----------|----------|--------|
| POST | /api/orders | Customer |
| GET | /api/orders/my | Customer |
| GET | /api/orders/:id | Authenticated |
| PATCH | /api/orders/:id/status | Seller/Admin |
| DELETE | /api/orders/:id | Customer |

---

# 📬 Sample Requests

## Register

```http
POST /api/auth/register
```

```json
{
  "name": "Siva Setti",
  "email": "siva@example.com",
  "password": "SecurePassword123",
  "role": "customer"
}
```

---

## Login

```http
POST /api/auth/login
```

```json
{
  "email": "siva@example.com",
  "password": "SecurePassword123"
}
```

---

## Upload Food

```http
POST /api/food
```

Headers

```http
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

Body

| Field | Type |
|---------|------|
| name | String |
| price | Number |
| quantity | Number |
| veg | Boolean |
| expiry_time | Datetime |
| image | File |

---

## Place Order

```http
POST /api/orders
```

```json
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

# 📁 Postman Collection

The repository includes a Postman collection for testing all available APIs.

Import the collection from:

```text
postman/
└── collections/
```

Configure your environment variables and begin testing immediately.
---

# 🔒 Security

Security is integrated throughout FoodZeep rather than being treated as an afterthought.

## Authentication & Authorization

- JWT-based Authentication
- Role-Based Authorization (Customer, Seller, Admin)
- Protected REST Endpoints
- Password Hashing using bcrypt

---

## API Security

- Secure HTTP Headers using Helmet
- Configurable CORS Policy
- Request Rate Limiting
- Input Validation
- Input Sanitization
- Centralized Error Handling

---

## Data Protection

- Environment Variables for Sensitive Configuration
- Parameterized SQL Queries
- Password Hashing
- Transactional Database Operations

---

## Future Improvements

- Refresh Tokens
- Email Verification
- Password Reset
- OAuth (Google Login)
- Multi-Factor Authentication (MFA)
- Secret Management
- Audit Logs

---

# ⚡ Performance Optimizations

FoodZeep is designed with performance in mind while keeping the architecture simple enough for an MVP.

## Current Optimizations

- MySQL Connection Pooling
- Database Transactions
- Pagination
- Modular Architecture
- Graceful Shutdown
- Structured Logging

---

## Planned Optimizations

- Database Indexing
- Query Optimization
- Redis Caching
- CDN for Static Assets
- Compression
- Lazy Loading
- Read Replicas

---

# 📊 Logging & Observability

FoodZeep uses structured logging to improve debugging and production visibility.

## Logging

- Winston
- Morgan
- Request Logging
- Error Logging
- HTTP Status Logging

---

## Logged Information

- Timestamp
- HTTP Method
- Request Path
- Status Code
- Client IP
- Error Message

Example Log

```json
{
  "timestamp":"2026-07-14T09:00:00Z",
  "level":"error",
  "method":"POST",
  "path":"/api/auth/register",
  "status":400,
  "message":"Email already exists"
}
```

---

# ⏰ Background Jobs

FoodZeep uses scheduled background jobs to automate repetitive maintenance tasks.

Current Jobs

- Expired Food Cleanup
- Database Maintenance

Future Jobs

- Email Notifications
- Daily Reports
- Order Reminders
- Analytics Generation
- Cache Cleanup

Current Scheduler

- Node Cron

Future Queue System

- BullMQ + Redis *(planned)*

---

# 🗄 Database Design

Current database follows a normalized relational structure.

Core entities include:

- Users
- Food
- Orders
- Order Items

Relationships

```text
Users
   │
   ├──────────────┐
   │              │
Foods         Orders
                  │
                  │
            Order Items
```

Future additions

- Restaurants
- Shopping Cart
- Addresses
- Payments
- Reviews
- Notifications

---

# 📈 Engineering Highlights

FoodZeep demonstrates practical backend engineering concepts including:

- Feature-Based Modular Architecture
- Layered Application Design
- RESTful APIs
- JWT Authentication
- Role-Based Authorization
- Database Transactions
- Schema Versioning
- Connection Pooling
- Structured Logging
- Background Scheduling
- API Documentation
- Secure File Uploads
- Global Error Handling
- Graceful Shutdown
- Production-Oriented Project Structure

---

# 🧪 Testing Strategy

Testing will evolve alongside the application.

## Planned

- Unit Testing
- Integration Testing
- API Testing
- End-to-End Testing

Recommended Tools

- Jest
- Supertest
- Postman
- GitHub Actions

---

# 📍Current Project Roadmap

## Phase 1 — MVP

- [x] Authentication
- [x] User Management
- [x] Food Module
- [x] Orders
- [x] Swagger Documentation
- [x] Database Migrations
- [x] Logging
- [x] Cron Jobs

---

## Phase 2 — Product Features

- [ ] Shopping Cart
- [ ] Address Management
- [ ] Restaurant Module
- [ ] Payment Integration
- [ ] Order Tracking
- [ ] Reviews & Ratings

---

## Phase 3 — Production Readiness

- [ ] Docker
- [ ] CI/CD
- [ ] Monitoring
- [ ] Health Checks
- [ ] Backup Strategy
- [ ] Environment Validation

---

## Phase 4 — Performance

- [ ] Database Indexing
- [ ] Redis Caching
- [ ] Query Optimization
- [ ] CDN
- [ ] Image Optimization

---

## Phase 5 — Scaling

- [ ] Message Queues
- [ ] Event-Driven Architecture
- [ ] API Gateway
- [ ] Microservices
- [ ] Load Balancing
- [ ] Horizontal Scaling
---

# 🚀 Deployment

FoodZeep is currently under active development.

The initial production deployment will include:

| Component | Technology |
|-----------|------------|
| Frontend | React |
| Backend | Node.js + Express |
| Database | MySQL |
| Reverse Proxy | Nginx *(planned)* |
| SSL | Let's Encrypt *(planned)* |
| Process Manager | PM2 *(planned)* |
| Hosting | AWS / Render / Railway *(TBD)* |

---

## Deployment Checklist

- [ ] Production Environment Variables
- [ ] HTTPS
- [ ] Reverse Proxy
- [ ] Process Manager
- [ ] Automated Deployment
- [ ] Health Checks
- [ ] Monitoring
- [ ] Database Backup
- [ ] Log Rotation

---

# 📚 Learning Objectives

FoodZeep is not just a software project.

It is an engineering portfolio built to understand how modern backend systems evolve from an MVP into production-ready applications.

Throughout this project, the following concepts are being learned and implemented incrementally:

### Backend Engineering

- REST API Design
- Layered Architecture
- Modular Monolith
- Authentication & Authorization
- Database Transactions
- Connection Pooling
- Pagination
- File Uploads

### Software Engineering

- Clean Architecture
- SOLID Principles
- DRY
- KISS
- Error Handling
- Logging
- Configuration Management

### Database Engineering

- Schema Design
- Normalization
- Migrations
- Indexing
- Query Optimization

### System Design

- Scalability
- Caching
- Load Balancing
- Background Jobs
- Message Queues
- API Gateway
- Distributed Systems

### DevOps

- Docker
- CI/CD
- Monitoring
- Deployment
- Cloud Infrastructure

---

# 🌱 Future Enhancements

The long-term vision for FoodZeep extends beyond the MVP.

Future enhancements include:

## Customer Experience

- Shopping Cart
- Wishlist
- Saved Addresses
- Coupon System
- Reviews & Ratings
- Favorites

---

## Seller Dashboard

- Sales Analytics
- Inventory Management
- Order Dashboard
- Revenue Reports

---

## Platform Features

- Payment Gateway Integration
- Live Order Tracking
- Notifications
- Email Services
- SMS Integration

---

## Engineering

- Redis
- Docker
- CI/CD
- Health Checks
- Prometheus
- Grafana
- Distributed Caching
- Event-Driven Architecture
- Microservices *(when justified)*

---

# 🤝 Contributing

Contributions, suggestions, and feedback are always welcome.

If you would like to contribute:

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Push your branch.
5. Open a Pull Request.

Please ensure your code follows the existing project structure and coding conventions.

---

# 📜 License

This project is licensed under the **MIT License**.

Feel free to use, modify, and learn from the project while providing appropriate attribution.

---

# 👨‍💻 Author

## Siva Setti

Software Engineer | Backend Developer | Full Stack Learner

Currently building **FoodZeep** to learn software engineering by solving real-world product challenges.

### Connect with me

- GitHub: https://github.com/sivasetti
- LinkedIn: https://linkedin.com/in/sivasetti

---

# ⭐ If You Like This Project

If FoodZeep helped you learn something or you found the project interesting:

- ⭐ Star the repository
- 🍴 Fork the project
- 🐛 Report issues
- 💡 Suggest improvements

Your support helps the project grow.

---

# 🙏 Acknowledgements

Special thanks to the open-source community and the maintainers of the technologies that power this project.

- Node.js
- Express.js
- React
- MySQL
- Knex.js
- Swagger
- Winston
- JWT
- Multer

---

<div align="center">

## 🍔 FoodZeep

**Building a Food Delivery Platform, One Engineering Decision at a Time.**

Made with ❤️ by **Siva Setti**

</div>