# API Design

## Base URL

```
http://localhost:5000
```

## Authentication

All protected endpoints require JWT in the `Authorization` header:

```http
Authorization: Bearer <token>
```

Get token from `POST /api/auth/login`.

## Response Format

### Success

```json
{
  "success": true,
  "message": "Operation completed",
  "data": { }
}
```

### Error

```json
{
  "success": false,
  "message": "Error description"
}
```

## Rate Limiting

- **Limit:** 100 requests per 15 minutes
- **Scope:** All `/api` routes
- **Response:** 429 Too Many Requests

## Endpoints

### Authentication

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login and get JWT |

#### POST /api/auth/register

**Request:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "role": "buyer"
}
```

**Roles:** `buyer`, `seller`, `Admin`

**Response (201):**

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "buyer"
  }
}
```

**Errors:**
- 400: Email already exists
- 400: Validation error

#### POST /api/auth/login

**Request:**

```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "buyer"
    }
  }
}
```

**Errors:**
- 401: Invalid credentials
- 400: User blocked

---

### Food

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/food/add` | Seller/Admin | Add food item with image |
| GET | `/api/food/my-food` | Seller/Admin | Get seller's food items |
| GET | `/api/food/all` | Public | Get all available food |
| GET | `/api/food/:id` | Public | Get single food item |
| PUT | `/api/food/update/:id` | Seller/Admin | Update food item |
| DELETE | `/api/food/delete/:id` | Seller/Admin | Delete food item |

#### POST /api/food/add

**Request:** `multipart/form-data`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | Yes | Food item name |
| price | number | Yes | Price in decimal |
| quantity | integer | Yes | Available quantity |
| veg | boolean | Yes | Vegetarian flag |
| expiry_time | string | Yes | Expiration datetime |
| image | file | Yes | Food image (jpg/png/webp) |

**Response (201):**

```json
{
  "success": true,
  "message": "Food item added successfully",
  "data": {
    "id": 1,
    "name": "Chicken Biryani",
    "price": 350.00,
    "quantity": 20,
    "veg": false,
    "expiry_time": "2026-06-01T23:59:59.000Z",
    "image_url": "/uploads/1234567890-biryani.jpg",
    "seller_id": 1
  }
}
```

**Errors:**
- 400: Validation error
- 401: Not authenticated
- 403: Not authorized (seller only)

#### GET /api/food/all

**Query Parameters:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| page | integer | 1 | Page number |
| limit | integer | 10 | Items per page |
| search | string | - | Search by name |
| veg | string | - | Filter: "true" or "false" |
| sort | string | id | Sort by: id, name, price, expiry_time |
| order | string | ASC | Sort order: ASC or DESC |

**Request:**

```http
GET /api/food/all?page=1&limit=10&veg=true&sort=price&order=ASC
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": 1,
        "name": "Paneer Tikka",
        "price": 250.00,
        "quantity": 15,
        "veg": true,
        "image_url": "/uploads/1234567890-paneer.jpg",
        "seller_id": 2
      }
    ],
    "pagination": {
      "total": 50,
      "page": 1,
      "limit": 10,
      "totalPages": 5
    }
  }
}
```

#### PUT /api/food/update/:id

**Request:**

```json
{
  "name": "Special Biryani",
  "price": 400.00,
  "quantity": 25,
  "veg": false,
  "expiry_time": "2026-06-15 18:00:00"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Food item updated successfully"
}
```

**Errors:**
- 403: Not your food item
- 404: Food not found

#### DELETE /api/food/delete/:id

**Response (200):**

```json
{
  "success": true,
  "message": "Food item deleted successfully"
}
```

**Side Effects:**
- Deletes associated image file from uploads/

---

### Orders

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/orders/checkout` | Buyer/Admin | Place new order |
| GET | `/api/orders/my-orders` | Buyer/Admin | Get user's orders |
| PATCH | `/api/orders/status/:id` | Seller/Admin | Update order status |

#### POST /api/orders/checkout

**Request:**

```json
{
  "total_amount": 700.00,
  "items": [
    {
      "food_id": 1,
      "quantity": 2,
      "price": 350.00
    }
  ]
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "Order placed successfully",
  "data": {
    "order_id": 1
  }
}
```

**Business Rules:**
- Runs in a database transaction
- Validates food items exist and have sufficient quantity
- Updates food_item quantity atomically

**Errors:**
- 400: Insufficient stock
- 400: Food item not found
- 401: Not authenticated

#### GET /api/orders/my-orders

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "order_id": 1,
      "total_amount": 700.00,
      "status": "PLACED",
      "created_at": "2026-07-14T10:30:00.000Z",
      "items": [
        {
          "name": "Chicken Biryani",
          "quantity": 2,
          "price": 350.00
        }
      ]
    }
  ]
}
```

#### PATCH /api/orders/status/:id

**Request:**

```json
{
  "status": "PREPARING"
}
```

**Valid Statuses:**

| Status | Description |
|--------|-------------|
| PLACED | Order just created |
| PREPARING | Being prepared |
| OUT_FOR_DELIVERY | In transit |
| DELIVERED | Completed |
| CANCELLED | Cancelled |

**Response (200):**

```json
{
  "success": true,
  "message": "Order status updated successfully"
}
```

**Errors:**
- 403: Not authorized (seller only)
- 400: Invalid status

---

### Swagger Documentation

Interactive API docs available at:

```
http://localhost:5000/api-docs
```

Provides:
- Endpoint exploration
- Request/response examples
- Authentication testing
- Schema validation

## Error Codes

| Code | Meaning |
|------|---------|
| 400 | Bad Request / Validation Error |
| 401 | Not Authenticated |
| 403 | Not Authorized |
| 404 | Resource Not Found |
| 409 | Conflict (duplicate entry) |
| 429 | Rate Limit Exceeded |
| 500 | Internal Server Error |

## File Uploads

- **Storage:** `backend/uploads/`
- **Naming:** `{timestamp}-{random}{extension}`
- **Access:** `GET /uploads/{filename}`
- **Limits:** 10KB JSON body, file size via multer config

## Pagination Pattern

All list endpoints support:

```json
{
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```

## Status Codes Summary

| Endpoint | Success | Auth Error | Validation Error |
|----------|---------|------------|------------------|
| Register | 201 | - | 400 |
| Login | 200 | 401 | 400 |
| Add Food | 201 | 401/403 | 400 |
| Get Food | 200 | - | - |
| Update Food | 200 | 401/403 | 400 |
| Delete Food | 200 | 401/403 | - |
| Place Order | 201 | 401 | 400 |
| Get Orders | 200 | 401 | - |
| Update Status | 200 | 401/403 | 400 |
