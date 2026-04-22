# ESale Frontend

Electronics E-commerce Platform Frontend built with React

## Features

- User Authentication
- Product Browsing & Search
- Shopping Cart
- Order Management
- User Dashboard
- Responsive Design

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Navigation.jsx
│   │   │   └── Loader.jsx
│   │   ├── layout/
│   │   │   ├── MainLayout.jsx
│   │   │   └── AuthLayout.jsx
│   │   ├── products/
│   │   │   ├── ProductCard.jsx
│   │   │   ├── ProductList.jsx
│   │   │   └── ProductDetails.jsx
│   │   ├── auth/
│   │   │   ├── LoginForm.jsx
│   │   │   └── RegisterForm.jsx
│   │   └── cart/
│   │       ├── CartItem.jsx
│   │       └── CartSummary.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Products.jsx
│   │   ├── ProductDetail.jsx
│   │   ├── Cart.jsx
│   │   ├── Checkout.jsx
│   │   ├── OrderHistory.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   └── NotFound.jsx
│   ├── services/
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── productService.js
│   │   ├── cartService.js
│   │   └── orderService.js
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useProducts.js
│   │   ├── useCart.js
│   │   └── useFetch.js
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── CartContext.jsx
│   ├── store/
│   │   ├── authStore.js
│   │   ├── cartStore.js
│   │   └── productStore.js
│   ├── utils/
│   │   ├── constants.js
│   │   ├── helpers.js
│   │   └── validators.js
│   ├── styles/
│   │   ├── globals.css
│   │   ├── variables.css
│   │   └── animations.css
│   ├── assets/
│   │   ├── images/
│   │   └── icons/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.html
├── public/
├── vite.config.js
├── package.json
├── .env.example
└── README.md
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

3. Update environment variables:
```
VITE_API_URL=http://localhost:8000/api
```

## Running the Development Server

```bash
npm run dev
```

Server will run at http://localhost:5173 (or http://localhost:3000)

## Building for Production

```bash
npm run build
```

## Linting

```bash
npm run lint        # Check for lint errors
npm run lint:fix    # Fix lint errors
```

## Pages

- **Home** (`/`) - Landing page with featured products
- **Products** (`/products`) - Browse all products with filters
- **Product Detail** (`/products/:id`) - Individual product page
- **Cart** (`/cart`) - Shopping cart
- **Checkout** (`/checkout`) - Order checkout
- **Order History** (`/orders`) - User's past orders
- **Login** (`/login`) - User login
- **Register** (`/register`) - User registration
- **Dashboard** (`/dashboard`) - User profile and settings
- **404** - Not found page

## API Integration

All API calls are made through the API service layer in `src/services/api.js`.

Base URL can be configured via `VITE_API_URL` environment variable.

## State Management

Using Zustand for global state management:
- Authentication state (user, token, isLoggedIn)
- Shopping cart state
- Product data

## Next Steps

1. Set up routing with React Router
2. Implement authentication pages and forms
3. Create product listing and detail pages
4. Implement shopping cart functionality
5. Create checkout and order management pages
6. Add CSS styling and responsive design
7. Implement error handling and loading states
8. Add form validation
9. Set up API integration with backend
10. Create unit and integration tests
