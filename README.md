# 🍔 foodZeep Backend API

A production-grade, highly secure RESTful food delivery platform API built using **Node.js**, **Express.js**, and **MySQL**. Engineered with a clean, decoupled Layered Architecture (Controller-Service-Model), enterprise logging, data sanitization, atomic database transactions, and comprehensive native Swagger UI documentation.

[![Run in Postman](https://run.pstmn.io/button.svg)](#) <!-- Update link when collection is uploaded -->

---

## 🛠️ Tech Stack & Architecture

- **Runtime Engine:** Node.js (v24+)
- **Framework:** Express.js 5
- **Database:** MySQL (`mysql2` driver with connection pooling)
- **API Blueprinting:** Swagger UI (OpenAPI 3.0)
- **Security & Perimeter:** Helmet, CORS, Express Rate Limit, XSS-Clean
- **Authentication:** JWT (JSON Web Tokens)
- **Password Security:** Bcrypt
- **Media Engine:** Multer (Local File System Storage)
- **Structured Logging:** Winston + Morgan HTTP Stream

---

## 🔒 Production-Grade Security Features

- **XSS Mitigation:** Global data sanitization via `xss-clean` to scrub `req.body`, `req.query`, and `req.params` before inputs hit controllers.
- **Perimeter Defense:** Layered armor using `helmet` to hide tech stacks (`X-Powered-By`) and `express-rate-limit` restricting IPs to **100 requests per 15 minutes**.
- **Data Integrity:** Enterprise **Transaction Wrapper Pattern** implemented via a decoupled `runInTransaction` utility, ensuring atomic operations (e.g., creating an order and its line items simultaneously) without polluting the business service layer with raw DB connection strings.
- **Query Optimization:** Strategic indexing applied to high-traffic columns (`name`, `seller_id`, `user_id`) to transition searches from slow $O(N)$ full-table scans to microsecond $O(\log N)$ B-Tree lookups.

---

## ✅ Prerequisites

Before you get started, ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) v24 or higher
- [MySQL Server](https://dev.mysql.com/downloads/mysql/) (v8.0+) or local instance running via XAMPP/WampServer
- npm (Node Package Manager)

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone <your-repository-url>
cd foodZeep/backend
2. Install dependenciesBashnpm install
3. Set up environment variablesCreate a .env file inside the backend/ root directory (see the Environment Variables table below).4. Hydrate the DatabaseRun the schema-matched seeder script to instantly populate mock menus and users for immediate endpoint testing:Bashnode src/utils/seeder.js
5. Run the projectBash# Development Mode (With Nodemon auto-restarts)
npm run dev

# Production Mode
npm start
🔐 Environment VariablesVariableDescriptionExample / DefaultPORTPort the Express server runs on5000DB_HOSTMySQL connection host addresslocalhostDB_USERMySQL username credentialsrootDB_PASSWORDMySQL password credentialsyour_secure_passwordDB_NAMETarget application schema database namefoodzeep_dbJWT_SECRETSecret key for signing authorization tokenssuper_strong_unpredictable_secret_keyNODE_ENVMode setting changing log output rulesdevelopment⚠️ Security Warning: Never commit your production .env files to git version control.📁 Project StructurePlaintextsrc/
├── server.js                     # Main entry point (HTTP Server + Graceful Shutdown)
├── app.js                        # Express application setup & global middlewares
├── config/
│   ├── db.js                     # MySQL Pool connection configuration
│   ├── logger.js                 # Winston multi-transport structured logger
│   └── swagger.js                # Swagger JSDoc configurations
├── middlewares/
│   ├── error.middleware.js       # Centralized global error handler capturing stack traces
│   └── auth.middleware.js        # JWT payload badge verification
├── utils/
│   ├── transaction.js            # Reusable transactional unit-of-work utility
│   └── seeder.js                 # Automated schema-matched database test data builder
└── modules/                      # Feature-driven modular directories
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
    └── orders/
        ├── orders.controller.js
        ├── orders.service.js
        ├── orders.model.js
        └── orders.routes.js
📡 API EndpointsAll protected routes require a JWT bearer token passed inside the HTTP request headers setup:PlaintextAuthorization: Bearer <your_access_token>
Authentication — /api/authMethodEndpointDescriptionAuth RequiredPOST/api/auth/registerRegister a new platform account❌ NoPOST/api/auth/loginAuthenticate details and fetch bearer token❌ NoFood Menu — /api/foodMethodEndpointDescriptionAuth RequiredPOST/api/foodUpload food items with profile image✅ Yes (Seller Only)GET/api/foodGet available dishes (Offset Paginated)❌ NoQuery parameters for /api/food:Plaintext?page=1&limit=10
Orders — /api/ordersMethodEndpointDescriptionAuth RequiredPOST/api/ordersPlace an order executing atomic database writes✅ Yes (Customer Only)GET/api/orders/myRetrieve personal paginated order logs✅ Yes📝 Payload Request Examples1. User Registration (POST /api/auth/register)JSON{
  "name": "Siva Setti",
  "email": "siva@example.com",
  "password": "SecurePassword123",
  "role": "customer" 
}
2. User Login (POST /api/auth/login)JSON{
  "email": "siva@example.com",
  "password": "SecurePassword123"
}
Response Output:JSON{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
3. Uploading Food Item (POST /api/food)⚠️ Note: Requires HTTP request content-type header structured as multipart/form-data to receive the image file processing.KeyTypeValue / ExamplenameTextChicken BiryanipriceText350.00quantityText30vegText0 (for Non-Veg) or 1 (for Veg)expiry_timeText2026-06-01 23:59:59imageFile[Upload item_photo.jpg]4. Checkout Order Placing (POST /api/orders)JSON{
  "total_amount": 700.00,
  "items": [
    {
      "food_id": 1,
      "quantity": 2,
      "price": 350.00
    }
  ]
}
🛑 Resilient Process Lifecycle (Graceful Shutdown)The application implements a strict zero-downtime lifecycle process. When receiving termination signals (SIGINT, SIGTERM), the engine actively prevents data corruption:Locks Gates: Stops accepting incoming connection payloads immediately via server.close().Drains Queries: Allows active in-flight requests and transactions to finish computing safely.Releases Pool: Safely drains and disconnects the MySQL connection pool cleanly before exiting the runtime environment.