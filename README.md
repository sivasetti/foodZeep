---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MySQL (v8 or higher)
- npm

### Installation

1. **Clone the repository**
```bash
   git clone https://github.com/yourusername/foodzeep.git
   cd foodzeep
```

2. **Install dependencies**
```bash
   cd backend
   npm install
```

3. **Set up environment variables**
   
   Create a `.env` file in the `backend/` directory:
```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=yourpassword
   DB_NAME=foodzeep
   PORT=3000
   JWT_SECRET=your_secret_key_here
```

4. **Set up database**
```bash
   npm run setup:db
```

5. **Run the server**
```bash
   npm run dev
```

6. **Test the API**
   
   Open browser: `http://localhost:3000`
   
   You should see:
```json
   {
     "message": "FoodZeep API running 🚀"
   }
```

---

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Restaurants/Hotels
- `GET /api/restaurants` - Get all restaurants
- `POST /api/restaurants` - Create restaurant (Seller/Admin)
- `PUT /api/restaurants/:id` - Update restaurant (Seller/Admin)

### Items
- `GET /api/items` - Get all items
- `POST /api/items` - Create item (Seller)
- `PUT /api/items/:id` - Update item (Seller)
- `DELETE /api/items/:id` - Delete item (Seller)

### Orders
- `POST /api/orders` - Create order (Buyer)
- `GET /api/orders` - Get orders
- `PUT /api/orders/:id/accept` - Accept order (Seller)

### Payments
- `POST /api/payments` - Make payment (Buyer)
- `GET /api/payments/history` - Payment history

---

## 🧪 Testing

Use Postman to test API endpoints.

---

## 📝 Development Status

🚧 **Work in Progress** 🚧

- [ ] Project setup
- [ ] Database design
- [ ] Authentication module
- [ ] Restaurant CRUD
- [ ] Items CRUD
- [ ] Orders system
- [ ] Payment integration

---

## 👨‍💻 Author

Learning full-stack development by building foodZeep to reduce food wastage.

---

## 📄 License

This project is for educational purposes.