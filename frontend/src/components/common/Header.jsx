import { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useCart } from '../../hooks/useCart'
import { 
  Home, 
  Package, 
  Layers, 
  Settings, 
  Newspaper, 
  User, 
  ShoppingCart,
  LogOut,
  ChevronDown
} from 'lucide-react'
import '../../styles/Header.css'

export default function Header() {
  const { isLoggedIn, user, logout } = useAuth()
  const { itemCount } = useCart()
  const location = useLocation()
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef(null)

  const isActive = (path) => location.pathname === path

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo-section">
          <Package className="logo-icon" size={24} />
          <span>Hệ thống ESale trực tuyến</span>
        </Link>

        <nav className="nav">
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
            <Home size={18} />
            <span>Trang chủ</span>
          </Link>
          <Link to="/categories" className={`nav-link ${isActive('/categories') ? 'active' : ''}`}>
            <Layers size={18} />
            <span>Danh mục</span>
          </Link>
          
          {user?.is_admin && (
            <Link to="/admin" className={`nav-link ${isActive('/admin') ? 'active' : ''}`}>
              <Settings size={18} />
              <span>Quản trị</span>
            </Link>
          )}
          
          <Link to="/news" className={`nav-link ${isActive('/news') ? 'active' : ''}`}>
            <Newspaper size={18} />
            <span>Tin tức</span>
          </Link>
        </nav>

        <div className="header-actions">
          <Link to="/cart" className="cart-button">
            <ShoppingCart size={22} />
            {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
          </Link>

          {isLoggedIn ? (
            <div className="user-menu-container" ref={dropdownRef}>
              <div 
                className="user-section" 
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <User size={18} />
                <span className="username">{user?.tenTK || 'User'}</span>
                <ChevronDown size={14} className={showDropdown ? 'rotate-180' : ''} />
              </div>
              
              {showDropdown && (
                <div className="user-dropdown card">
                  <div className="dropdown-header">
                    <strong>{user?.tenTK}</strong>
                    <span>{user?.email}</span>
                  </div>
                  <div className="dropdown-divider"></div>
                  {user?.is_admin && (
                    <Link to="/admin" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                      <Settings size={16} />
                      <span>Quản trị</span>
                    </Link>
                  )}
                  <Link to="/orders" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                    <Package size={16} />
                    <span>Đơn hàng</span>
                  </Link>
                  <div className="dropdown-divider"></div>
                  <button onClick={() => { logout(); setShowDropdown(false); }} className="dropdown-item logout-item">
                    <LogOut size={16} />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-btns">
              <Link to="/login" className="btn-login">Đăng nhập</Link>
              <Link to="/register" className="btn-register">Đăng ký</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
