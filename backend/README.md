# ESale Backend API

Electronics E-commerce Platform Backend built with FastAPI

## Features

- User Authentication & Authorization (TaiKhoan)
- Product Management (CRUD) with specifications
- Supplier Management (NhaCungCap)
- Inventory Management (TonKho)
- Shopping Cart (Giohang)
- Order Management (Donhang)
- Payment Processing (PTThanhToan)
- Product Reviews (Reviews)
- Activity Logging (Logs)
- API Documentation (Swagger UI)

## Database Schema

See [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md) for complete database structure.

### Main Tables
- **TaiKhoan**: User accounts
- **DanhMuc**: Product categories
- **SanPham**: Products
- **NhaCungCap**: Suppliers
- **TonKho**: Inventory/Stock
- **AnhSP**: Product images
- **ThongsoSP**: Product specifications
- **Giohang**: Shopping cart
- **Donhang**: Orders
- **PTThanhToan**: Payments
- **Reviews**: Product reviews
- **Logs**: Activity logs

## Project Structure

```
backend/
├── app/
│   ├── api/
│   │   └── v1/
│   │       ├── endpoints/
│   │       │   ├── auth.py         (Authentication with TaiKhoan)
│   │       │   ├── users.py        (User management)
│   │       │   ├── products.py     (Product & inventory CRUD)
│   │       │   ├── categories.py   (Category management)
│   │       │   ├── cart.py         (Shopping cart)
│   │       │   └── orders.py       (Orders, payments, reviews)
│   │       └── api.py              (Router configuration)
│   ├── core/
│   │   ├── config.py               (Configuration)
│   │   ├── security.py             (JWT & password)
│   │   └── database.py             (Database connection)
│   ├── models/                     (SQLAlchemy models)
│   │   ├── user.py                 (TaiKhoan, Logs)
│   │   ├── product.py              (DanhMuc, SanPham, etc.)
│   │   └── order.py                (Giohang, Donhang, etc.)
│   ├── schemas/                    (Pydantic models)
│   │   ├── user.py
│   │   ├── product.py
│   │   └── order.py
│   ├── services/                   (Business logic)
│   ├── utils/                      (Utilities)
│   ├── middleware/                 (Custom middleware)
│   └── main.py                     (Application entry)
├── tests/
│   ├── unit/
│   └── integration/
├── migrations/                     (Database migrations)
├── requirements.txt
├── .env.example
├── DATABASE_SCHEMA.md              (Database structure)
└── README.md
```

## Installation

1. Create virtual environment:
```bash
python -m venv venv
source venv/Scripts/activate  # Windows
source venv/bin/activate      # Linux/Mac
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

4. Update environment variables in `.env` (especially database connection)

## Running the Server

```bash
python app/main.py
```

Or with uvicorn:
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## API Documentation

Once the server is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Database Configuration

Default uses SQLite. To use SQL Server (as per team requirement):

1. Install SQL Server driver:
```bash
pip install pyodbc
```

2. Update `.env`:
```
DATABASE_URL=mssql+pyodbc://username:password@server/database?driver=ODBC+Driver+17+for+SQL+Server
```

Other database options:
- PostgreSQL: `postgresql://user:password@localhost/esale_db`
- MySQL: `mysql+pymysql://user:password@localhost/esale_db`

## API Endpoints

### Authentication (TaiKhoan)
- `POST /api/v1/auth/register` - Register new account
- `POST /api/v1/auth/login` - Login and get token
- `POST /api/v1/auth/refresh-token` - Refresh access token
- `POST /api/v1/auth/logout` - Logout

### Users (TaiKhoan)
- `GET /api/v1/users/me` - Get current user
- `PUT /api/v1/users/me` - Update current user
- `GET /api/v1/users` - Get all users (admin)
- `GET /api/v1/users/{uID}` - Get user by ID (admin)
- `GET /api/v1/users/{uID}/logs` - Get user activity logs (admin)

### Products (SanPham)
- `GET /api/v1/products` - Get all products
- `GET /api/v1/products/{ID_sanpham}` - Get product details
- `POST /api/v1/products` - Create product (admin)
- `PUT /api/v1/products/{ID_sanpham}` - Update product (admin)
- `DELETE /api/v1/products/{ID_sanpham}` - Delete product (admin)
- `POST /api/v1/products/{ID_sanpham}/specs` - Add specifications (admin)
- `POST /api/v1/products/{ID_sanpham}/images` - Add product image (admin)
- `GET /api/v1/products/{ID_sanpham}/images` - Get product images
- `GET /api/v1/products/{ID_sanpham}/stock` - Get inventory info
- `PUT /api/v1/products/{ID_sanpham}/stock` - Update inventory (admin)

### Categories (DanhMuc)
- `GET /api/v1/categories` - Get all categories
- `GET /api/v1/categories/{ID_danhmuc}` - Get category
- `POST /api/v1/categories` - Create category (admin)
- `PUT /api/v1/categories/{ID_danhmuc}` - Update category (admin)
- `DELETE /api/v1/categories/{ID_danhmuc}` - Delete category (admin)

### Shopping Cart (Giohang)
- `GET /api/v1/cart` - Get user's cart
- `POST /api/v1/cart/items` - Add item to cart
- `PUT /api/v1/cart/items/{ID_giohang}` - Update cart item quantity
- `DELETE /api/v1/cart/items/{ID_giohang}` - Remove item from cart
- `DELETE /api/v1/cart` - Clear cart

### Orders (Donhang)
- `GET /api/v1/orders` - Get user's orders
- `GET /api/v1/orders/{ID_donhang}` - Get order details
- `POST /api/v1/orders` - Create order
- `PUT /api/v1/orders/{ID_donhang}` - Update order status (admin)
- `DELETE /api/v1/orders/{ID_donhang}` - Cancel order

### Payments (PTThanhToan)
- `POST /api/v1/orders/{ID_donhang}/payment` - Create payment
- `GET /api/v1/orders/{ID_donhang}/payment` - Get payment info
- `PUT /api/v1/orders/{ID_donhang}/payment` - Update payment status (admin)

### Reviews
- `POST /api/v1/orders/{ID_sanpham}/reviews` - Add product review
- `GET /api/v1/orders/{ID_sanpham}/reviews` - Get product reviews
- `PUT /api/v1/orders/reviews/{ID_review}` - Update review
- `DELETE /api/v1/orders/reviews/{ID_review}` - Delete review

## Testing with Postman

1. Download [Postman](https://www.postman.com/downloads/)
2. Use the Swagger UI (`/docs`) to explore endpoints
3. Get auth token from login endpoint
4. Add `Authorization: Bearer {token}` header to protected endpoints

## Model Fields Reference

### TaiKhoan (User Account)
- `uID` - User ID (PK)
- `tenTK` - Username
- `matkhau` - Password (hashed)
- `email` - Email
- `is_staff` - Staff status
- `is_admin` - Admin status

### SanPham (Product)
- `ID_sanpham` - Product ID (PK)
- `tenSP` - Product name
- `mota` - Description
- `gia` - Price
- `ID_danhmuc` - Category ID (FK)
- `supplier_ID` - Supplier ID (FK)
- `ID_HinhAnh` - Main image ID (FK)

### Giohang (Shopping Cart)
- `ID_giohang` - Cart item ID (PK)
- `uID` - User ID (FK)
- `ID_sanpham` - Product ID (FK)
- `soluong` - Quantity
- `gia` - Item price

### Donhang (Order)
- `ID_donhang` - Order ID (PK)
- `uID` - User ID (FK)
- `trangthai` - Order status (pending, confirmed, shipped, delivered, cancelled)
- `soluong` - Quantity
- `ID_sanpham` - Product ID (FK)
- `gia` - Order price

## Next Steps

1. Create database migrations
2. Implement service layer logic
3. Add authentication middleware
4. Implement payment gateway integration
5. Add email notifications
6. Create comprehensive test suite
7. Set up CI/CD pipeline
8. Implement admin dashboard
9. Add product search and filtering
10. Implement user ratings and reviews

## Environment Variables

See `.env.example` for all available options:
- `DATABASE_URL` - Database connection string
- `SECRET_KEY` - JWT secret key
- `ALGORITHM` - JWT algorithm
- `ACCESS_TOKEN_EXPIRE_MINUTES` - Token expiration time
- `CORS_ORIGINS` - Allowed CORS origins

## Troubleshooting

- **Database connection error**: Check DATABASE_URL in .env
- **Import errors**: Ensure all dependencies in requirements.txt are installed
- **Port already in use**: Change SERVER_PORT in .env
- **SQLAlchemy warnings**: Models must be imported in models/__init__.py

## License

Open source project for educational purposes

