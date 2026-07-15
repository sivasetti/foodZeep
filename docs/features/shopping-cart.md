# Shopping Cart Feature

## Overview
The shopping cart allows users to add, remove, and manage food items before checkout.

## Database Schema

### Tables

**cart_items**
- id (PK)
- user_id (FK → users)
- menu_item_id (FK → menu_items)
- quantity
- special_instructions (nullable)
- created_at
- updated_at

**carts**
- id (PK)
- user_id (FK → users, unique)
- status (active, ordered, abandoned)
- created_at
- updated_at

## API Endpoints

### Get Cart
- **GET** `/api/v1/cart`
- Returns all items in user's cart with totals

### Add to Cart
- **POST** `/api/v1/cart/items`
- Body: `{ menu_item_id, quantity, special_instructions? }`

### Update Cart Item
- **PATCH** `/api/v1/cart/items/:id`
- Body: `{ quantity, special_instructions? }`

### Remove from Cart
- **DELETE** `/api/v1/cart/items/:id`

### Clear Cart
- **DELETE** `/api/v1/cart`

## Business Rules

1. One active cart per user
2. Maximum 50 items per cart
3. Quantity limits per menu item (max 10)
4. Cart expires after 24 hours of inactivity
5. Price calculated at checkout time

## Edge Cases

- Item removed from menu while in cart
- Price change between add and checkout
- Restaurant closes while cart has items
- Concurrent modifications

## Implementation Priority

1. Basic CRUD operations
2. Cart total calculation
3. Item availability validation
4. Cart expiration
5. Price locking at checkout
