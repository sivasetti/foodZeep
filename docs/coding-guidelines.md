# Coding Guidelines

## Overview

Coding standards and conventions for the FoodZeep codebase.

---

## General Principles

- **KISS:** Keep It Simple, Stupid
- **DRY:** Don't Repeat Yourself
- **YAGNI:** You Aren't Gonna Need It
- **Separation of Concerns:** Each module has a single responsibility

---

## File Structure

### Module Pattern

```
backend/src/modules/<feature>/
  <feature>.routes.js      # Route definitions
  <feature>.controller.js  # Request handling
  <feature>.service.js     # Business logic
  <feature>.model.js       # Database queries
```

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Files | kebab-case | `auth.controller.js` |
| Variables | camelCase | `userId`, `orderStatus` |
| Functions | camelCase | `getUserById`, `createOrder` |
| Constants | UPPER_SNAKE | `MAX_RETRY_COUNT`, `JWT_SECRET` |
| Classes | PascalCase | `OrderService` |
| Routes | kebab-case | `/api/food-items` |
| DB tables | snake_case | `food_items`, `order_items` |

---

## JavaScript Style

### Module System

```javascript
// CommonJS (required)
const express = require('express');
const db = require('../config/db');

module.exports = {
  functionName,
  ClassName
};
```

### Variables

```javascript
// Use const by default
const userId = 123;

// Use let only when reassignment is needed
let counter = 0;
counter++;

// Never use var
```

### Functions

```javascript
// Use arrow functions for callbacks
const getUser = async (id) => {
  // ...
};

// Use function declarations for named functions
function validateEmail(email) {
  // ...
}

// Async/Await over callbacks
const fetchOrders = async (userId) => {
  try {
    const orders = await db.query('SELECT * FROM orders WHERE user_id = ?', [userId]);
    return orders;
  } catch (error) {
    throw error;
  }
};
```

### Error Handling

```javascript
// Always use try/catch with async/await
const createOrder = async (data) => {
  try {
    const order = await db.query('INSERT INTO orders ...');
    return order;
  } catch (error) {
    // Log and re-throw
    logger.error({ message: 'Failed to create order', error: error.message });
    throw error;
  }
};

// Controller error handling
const addOrder = async (req, res, next) => {
  try {
    const order = await orderService.createOrder(req.body);
    res.status(201).json({ success: true, data: order });
  } catch (error) {
    next(error); // Pass to error middleware
  }
};
```

---

## Backend Conventions

### Controllers

- Parse request (params, body, query)
- Call service method
- Format response
- Never contain business logic

```javascript
// Good controller
const getFood = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const food = await foodService.getFood(page, limit);
    res.json({ success: true, data: food });
  } catch (error) {
    next(error);
  }
};
```

### Services

- Business logic only
- Database operations via models
- Transaction handling
- Input validation rules

```javascript
// Good service
const placeOrder = async (userId, items, totalAmount) => {
  // Validate stock
  for (const item of items) {
    const food = await foodModel.getFoodById(item.food_id);
    if (food.quantity < item.quantity) {
      throw new Error('Insufficient stock');
    }
  }

  // Use transaction
  return await runInTransaction(async (connection) => {
    // Create order, items, update stock
  });
};
```

### Models

- Raw SQL queries
- Parameterized queries (never string concatenation)
- Return structured data

```javascript
// Good model
const getFoodById = async (id) => {
  const [rows] = await db.query('SELECT * FROM food_items WHERE id = ?', [id]);
  return rows[0];
};

// Bad model - SQL injection risk!
const getFoodById = async (id) => {
  const [rows] = await db.query(`SELECT * FROM food_items WHERE id = ${id}`);
  return rows[0];
};
```

### Routes

- Swagger JSDoc annotations
- Middleware stack: validate → protect → authorize → controller
- RESTful naming

```javascript
// Good routes
router.post(
  '/add',
  validate(addFoodSchema),      // 1. Validate input
  authMiddleware.protect,        // 2. Check authentication
  authMiddleware.authorize('seller', 'Admin'),  // 3. Check role
  upload.single('image'),        // 4. Handle file upload
  foodController.addFood         // 5. Handle request
);
```

### Validators

```javascript
// Joi schema pattern
const addFoodSchema = Joi.object({
  name: Joi.string().min(2).max(255).required(),
  price: Joi.number().positive().required(),
  quantity: Joi.number().integer().min(0).required(),
  veg: Joi.boolean().required(),
  expiry_time: Joi.date().greater('now').required()
});
```

---

## Error Messages

### User-Facing

```javascript
// Good - descriptive
{ message: 'Email address is already registered' }

// Bad - cryptic
{ message: 'ER_DUP_ENTRY' }
```

### Internal Logging

```javascript
// Good - structured
logger.error({
  message: 'Failed to create order',
  userId: req.user.id,
  error: error.message,
  stack: error.stack
});
```

---

## Response Format

### Success

```javascript
res.status(201).json({
  success: true,
  message: 'Resource created successfully',
  data: resource
});
```

### Error

```javascript
res.status(400).json({
  success: false,
  message: 'Validation failed: email is required'
});
```

### Paginated

```javascript
res.json({
  success: true,
  data: {
    data: items,
    pagination: {
      total: 100,
      page: 1,
      limit: 10,
      totalPages: 10
    }
  }
});
```

---

## Database

### Migrations

```javascript
exports.up = function(knex) {
  return knex.schema.createTable('table_name', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.timestamps(true, true);  // created_at, updated_at
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('table_name');
};
```

### Queries

```javascript
// Always use parameterized queries
const [rows] = await db.query(
  'SELECT * FROM users WHERE email = ? AND is_blocked = ?',
  [email, false]
);

// Use transactions for multi-table operations
await runInTransaction(async (connection) => {
  await connection.query('INSERT INTO orders ...');
  await connection.query('INSERT INTO order_items ...');
});
```

---

## Comments

### When to Comment

```javascript
// Good - explains WHY
// Transaction required to ensure order and stock are atomic
await runInTransaction(async (connection) => { ... });

// Bad - explains WHAT (code is self-explanatory)
// Insert order into database
await db.query('INSERT INTO orders ...');
```

### JSDoc for Functions

```javascript
/**
 * Place a new order with stock validation
 * @param {number} userId - The user placing the order
 * @param {Array} items - Order items with food_id, quantity, price
 * @param {number} totalAmount - Total order amount
 * @returns {number} Order ID
 */
const placeOrder = async (userId, items, totalAmount) => { ... };
```

---

## Testing (Planned)

### Structure

```
backend/
  src/
    modules/
      auth/
        auth.test.js
        auth.service.test.js
```

### Pattern

```javascript
describe('Order Service', () => {
  describe('placeOrder', () => {
    it('should create order with valid items', async () => {
      // Arrange
      const userId = 1;
      const items = [{ food_id: 1, quantity: 2, price: 100 }];

      // Act
      const orderId = await orderService.placeOrder(userId, items, 200);

      // Assert
      expect(orderId).toBeDefined();
    });

    it('should throw error for insufficient stock', async () => {
      // Arrange
      const items = [{ food_id: 1, quantity: 100, price: 100 }];

      // Act & Assert
      await expect(orderService.placeOrder(1, items, 10000))
        .rejects.toThrow('Insufficient stock');
    });
  });
});
```

---

## Git

### Commit Messages

```
<type>: <description>

Types:
- feat: New feature
- fix: Bug fix
- docs: Documentation
- style: Formatting
- refactor: Code restructuring
- test: Adding tests
- chore: Maintenance
```

### Examples

```
feat: add order status tracking
fix: prevent duplicate order submissions
docs: update API documentation
refactor: extract validation middleware
```

---

## Security

### Never

- Commit `.env` files
- Log sensitive data (passwords, tokens)
- Use `eval()` or `new Function()`
- Concatenate SQL queries
- Expose stack traces to clients

### Always

- Use parameterized queries
- Hash passwords with bcrypt
- Validate and sanitize input
- Use HTTPS in production
- Implement rate limiting

---

## Code Review Checklist

- [ ] Follows naming conventions
- [ ] Proper error handling
- [ ] No hardcoded values
- [ ] No SQL injection vulnerabilities
- [ ] Input validation present
- [ ] Response format consistent
- [ ] Comments explain WHY not WHAT
- [ ] No console.log in production
- [ ] Tests included (when applicable)
- [ ] Documentation updated
