import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './components/layout/MainLayout'
import AuthLayout from './components/layout/AuthLayout'
import { useAuthStore } from './store/authStore'

// Pages
import Home from './pages/Home'
import ProductDetail from './pages/ProductDetail'
import Categories from './pages/Categories'
import CategoryProducts from './pages/CategoryProducts'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import OrderHistory from './pages/OrderHistory'
import PaymentConfirm from './pages/PaymentConfirm'
import Login from './pages/Login'
import Register from './pages/Register'
import Admin from './pages/Admin'
import News from './pages/News'
import NewsDetail from './pages/NewsDetail'
import NotFound from './pages/NotFound'

import Forbidden from './pages/Forbidden'

// Protected Route component
const AdminRoute = ({ children }) => {
  const { user, isLoggedIn } = useAuthStore()
  
  if (!isLoggedIn) {
    return <Navigate to="/login" />
  }
  
  if (!user?.is_admin) {
    return <Forbidden />
  }
  
  return children
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Main Routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          {/* Redirect old /products to home */}
          <Route path="products" element={<Navigate to="/" replace />} />
          <Route path="products/:id" element={<ProductDetail />} />
          <Route path="categories" element={<Categories />} />
          <Route path="categories/:id" element={<CategoryProducts />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="payment-confirm" element={<PaymentConfirm />} />
          <Route path="orders" element={<OrderHistory />} />
          <Route path="news" element={<News />} />
          <Route path="news/:id" element={<NewsDetail />} />
          <Route 
            path="admin" 
            element={
              <AdminRoute>
                <Admin />
              </AdminRoute>
            } 
          />
        </Route>

        {/* Auth Routes */}
        <Route path="/" element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

export default App
