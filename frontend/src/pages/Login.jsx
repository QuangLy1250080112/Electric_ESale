import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import * as authService from '../services/authService'
import { useAuthStore } from '../store/authStore'
import { LogIn, User, Lock, Eye, EyeOff, Package } from 'lucide-react'
import '../styles/Login.css'

export default function Login() {
  const [formData, setFormData] = useState({ tenTK: '', matkhau: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { setUser, setToken } = useAuthStore()
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const data = await authService.login(formData.tenTK, formData.matkhau)
      setToken(data.access_token)
      setUser(data.user)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.detail || 'Đăng nhập thất bại')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page-wrapper">
      {/* Animated background */}
      <div className="login-bg">
        <div className="login-bg-shape shape-1"></div>
        <div className="login-bg-shape shape-2"></div>
        <div className="login-bg-shape shape-3"></div>
      </div>

      <div className="login-container">
        {/* Left side - Branding */}
        <div className="login-branding">
          <div className="branding-content">
            <div className="branding-logo">
              <Package size={48} />
            </div>
            <h1>ESale</h1>
            <p>Hệ thống mua sắm trực tuyến hàng đầu Việt Nam</p>
            <div className="branding-features">
              <div className="feature-item">
                <span className="feature-dot"></span>
                <span>Sản phẩm chính hãng 100%</span>
              </div>
              <div className="feature-item">
                <span className="feature-dot"></span>
                <span>Giao hàng nhanh toàn quốc</span>
              </div>
              <div className="feature-item">
                <span className="feature-dot"></span>
                <span>Thanh toán an toàn, bảo mật</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="login-form-section">
          <form onSubmit={handleSubmit} className="login-form-modern">
            <div className="form-header">
              <h2>Chào mừng trở lại!</h2>
              <p>Đăng nhập để tiếp tục mua sắm</p>
            </div>

            {error && (
              <div className="login-error animate-fade-in">
                <span>⚠️</span> {error}
              </div>
            )}

            <div className="login-field">
              <label>Tên tài khoản</label>
              <div className="input-wrapper">
                <User size={18} className="input-icon" />
                <input
                  type="text"
                  name="tenTK"
                  placeholder="Nhập tên tài khoản"
                  value={formData.tenTK}
                  onChange={handleChange}
                  required
                  autoFocus
                />
              </div>
            </div>

            <div className="login-field">
              <label>Mật khẩu</label>
              <div className="input-wrapper">
                <Lock size={18} className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="matkhau"
                  placeholder="Nhập mật khẩu"
                  value={formData.matkhau}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="login-submit-btn">
              {loading ? (
                <span className="login-spinner"></span>
              ) : (
                <>
                  <LogIn size={20} />
                  <span>Đăng nhập</span>
                </>
              )}
            </button>

            <div className="login-footer">
              <p>Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
