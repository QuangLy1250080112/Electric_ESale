import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useCart } from '../../hooks/useCart'

export default function Header() {
  const { isLoggedIn, user, logout } = useAuth()
  const { itemCount } = useCart()

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <h1>ESale</h1>
        </Link>

        <nav className="nav">
          <Link to="/products">Products</Link>
          {isLoggedIn && <Link to="/orders">Orders</Link>}
          {isLoggedIn && <Link to="/dashboard">Dashboard</Link>}
        </nav>

        <div className="header-actions">
          <Link to="/cart" className="cart-icon">
            Cart ({itemCount})
          </Link>

          {isLoggedIn ? (
            <div className="user-menu">
              <span>Welcome, {user?.full_name || user?.username}</span>
              <button onClick={logout}>Logout</button>
            </div>
          ) : (
            <div className="auth-links">
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
