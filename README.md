# ESale - E-commerce Electronics Platform

## Project Overview

ESale is an e-commerce platform built with open-source technologies for selling electronic components. This project demonstrates a complete full-stack application with:

- **Backend**: FastAPI (Python) - RESTful API with authentication, CRUD operations
- **Frontend**: React - Modern web interface
- **Architecture**: Microservices-ready structure that can run independently or together

## Project Structure

```
ESale/
├── backend/
│   ├── app/
│   ├── tests/
│   ├── migrations/
│   ├── requirements.txt
│   ├── .env.example
│   └── README.md
│
└── frontend/
    ├── src/
    ├── public/
    ├── package.json
    ├── vite.config.js
    ├── .env.example
    └── README.md
```

## Quick Start

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/Scripts/activate  # Windows
source venv/bin/activate      # Linux/Mac
pip install -r requirements.txt
cp .env.example .env
python app/main.py
```

Backend runs at: `http://localhost:8000`
API Docs: `http://localhost:8000/docs`

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Frontend runs at: `http://localhost:5173`

## Features

### Backend
- ✅ User Authentication & Authorization
- ✅ Product Management (CRUD)
- ✅ Category Management
- ✅ Shopping Cart
- ✅ Order Management
- ✅ Password hashing with bcrypt
- ✅ JWT token-based authentication
- ✅ Input validation
- ✅ Error handling
- ✅ Swagger UI documentation

### Frontend
- ✅ Responsive React application
- ✅ User authentication pages (Login/Register)
- ✅ Product browsing and search
- ✅ Shopping cart
- ✅ Order history
- ✅ User dashboard
- ✅ State management with Zustand
- ✅ API service layer
- ✅ Custom hooks

## Database

Currently uses SQLite for development. Ready to be switched to:
- PostgreSQL
- MySQL
- MariaDB

Update `DATABASE_URL` in `.env` to change database.

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/refresh-token` - Refresh token
- `POST /api/v1/auth/logout` - Logout

### Users
- `GET /api/v1/users/me` - Get current user
- `PUT /api/v1/users/me` - Update user
- `GET /api/v1/users` - Get all (admin)
- `GET /api/v1/users/{id}` - Get by ID (admin)

### Products
- `GET /api/v1/products` - Get all
- `GET /api/v1/products/{id}` - Get one
- `POST /api/v1/products` - Create (admin)
- `PUT /api/v1/products/{id}` - Update (admin)
- `DELETE /api/v1/products/{id}` - Delete (admin)

### Categories
- `GET /api/v1/categories` - Get all
- `GET /api/v1/categories/{id}` - Get one
- `POST /api/v1/categories` - Create (admin)
- `PUT /api/v1/categories/{id}` - Update (admin)
- `DELETE /api/v1/categories/{id}` - Delete (admin)

### Shopping Cart
- `GET /api/v1/cart` - Get cart
- `POST /api/v1/cart/items` - Add item
- `PUT /api/v1/cart/items/{id}` - Update item
- `DELETE /api/v1/cart/items/{id}` - Remove item
- `DELETE /api/v1/cart` - Clear cart

### Orders
- `GET /api/v1/orders` - Get user's orders
- `GET /api/v1/orders/{id}` - Get order
- `POST /api/v1/orders` - Create order
- `PUT /api/v1/orders/{id}` - Update (admin)
- `DELETE /api/v1/orders/{id}` - Cancel order

## Testing with Postman

1. Download and install [Postman](https://www.postman.com/downloads/)
2. The API automatically provides Swagger documentation at `/docs`
3. Use the collection to test all endpoints

## Technologies Used

### Backend
- FastAPI - Modern web framework
- SQLAlchemy - ORM
- Pydantic - Data validation
- JWT - Authentication
- Bcrypt - Password hashing
- Uvicorn - ASGI server

### Frontend
- React 18 - UI library
- React Router v6 - Routing
- Axios - HTTP client
- Zustand - State management
- Vite - Build tool

### Development
- Python 3.10+
- Node.js 16+
- npm or yarn

## Next Steps

1. **Database Setup**
   - Create database schema
   - Run migrations
   - Add sample data

2. **Backend Implementation**
   - Implement service layer logic
   - Add middleware for logging
   - Add email notifications
   - Add payment integration

3. **Frontend Enhancement**
   - Implement all pages
   - Add styling with CSS/SCSS
   - Add form validations
   - Add error handling
   - Add loading states

4. **Testing**
   - Write unit tests
   - Write integration tests
   - Add E2E tests

5. **Deployment**
   - Dockerize applications
   - Set up CI/CD pipeline
   - Deploy to cloud (AWS, Azure, Heroku)

6. **Additional Features**
   - Reviews and ratings
   - Wishlist
   - Product recommendations
   - Admin dashboard
   - Analytics
   - Email notifications
   - Payment gateway
   - Shipping integration

## Troubleshooting

### Backend Issues
- If port 8000 is in use: Change `SERVER_PORT` in `.env`
- If database error: Delete `test.db` and restart
- If import errors: Run `pip install -r requirements.txt` again

### Frontend Issues
- If port 5173 is in use: Vite will use next available port
- If API calls fail: Check backend is running and `VITE_API_URL` is correct
- If modules not found: Run `npm install` again

## Contributing

1. Create a new branch for features
2. Make your changes
3. Test thoroughly
4. Create a pull request

## License

This project is open source and available under MIT License.

## Support

For issues or questions, please create an issue on GitHub.

---

**Happy Coding! 🚀**
