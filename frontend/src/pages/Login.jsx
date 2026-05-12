import { useState, useEffect } from 'react'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import * as authService from '../services/authService'
import { useAuthStore } from '../store/authStore'
import { LogIn, User, Lock, Eye, EyeOff, Package, Mail, KeyRound } from 'lucide-react'
import '../styles/Login.css'

export default function Login() {
  const [searchParams] = useSearchParams()
  const resetToken = searchParams.get('token')
  
  const [formData, setFormData] = useState({ tenTK: '', matkhau: '', email: '', newPassword: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [mode, setMode] = useState(resetToken ? 'reset' : 'login') // login, forgot, reset
  const { setUser, setToken } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (resetToken) {
      setMode('reset')
    }
  }, [resetToken])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (error) setError('')
    if (success) setSuccess('')
  }

  const handleLogin = async (e) => {
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

  const handleForgot = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      await authService.forgotPassword(formData.email)
      setSuccess('Đã gửi email khôi phục. Vui lòng kiểm tra hộp thư của bạn.')
      setFormData(prev => ({...prev, email: ''}))
    } catch (err) {
      setError(err.response?.data?.detail || 'Có lỗi xảy ra')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      await authService.resetPassword(resetToken, formData.newPassword)
      setSuccess('Đặt lại mật khẩu thành công! Bạn có thể đăng nhập ngay.')
      setMode('login')
      navigate('/login') // remove token from URL
    } catch (err) {
      setError(err.response?.data?.detail || 'Token không hợp lệ hoặc đã hết hạn')
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
          <div className="login-form-modern">
            <div className="form-header">
              <h2>
                {mode === 'login' && 'Chào mừng trở lại!'}
                {mode === 'forgot' && 'Khôi phục mật khẩu'}
                {mode === 'reset' && 'Đặt lại mật khẩu'}
              </h2>
              <p>
                {mode === 'login' && 'Đăng nhập để tiếp tục mua sắm'}
                {mode === 'forgot' && 'Nhập email của bạn để nhận liên kết khôi phục'}
                {mode === 'reset' && 'Vui lòng nhập mật khẩu mới của bạn'}
              </p>
            </div>

            {error && (
              <div className="login-error animate-fade-in">
                <span>⚠️</span> {error}
              </div>
            )}
            
            {success && (
              <div className="login-success animate-fade-in" style={{background: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0', padding: '0.75rem 1rem', borderRadius: '12px', fontSize: '0.875rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                <span>✅</span> {success}
              </div>
            )}

            {mode === 'login' && (
              <form onSubmit={handleLogin}>
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
                
                <div style={{ textAlign: 'right', marginBottom: '1rem' }}>
                  <button type="button" onClick={() => { setMode('forgot'); setError(''); setSuccess(''); }} style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 600 }}>
                    Quên mật khẩu?
                  </button>
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
            )}

            {mode === 'forgot' && (
              <form onSubmit={handleForgot}>
                <div className="login-field">
                  <label>Địa chỉ Email</label>
                  <div className="input-wrapper">
                    <Mail size={18} className="input-icon" />
                    <input
                      type="email"
                      name="email"
                      placeholder="Nhập email của bạn"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      autoFocus
                    />
                  </div>
                </div>

                <button type="submit" disabled={loading} className="login-submit-btn">
                  {loading ? <span className="login-spinner"></span> : <span>Gửi liên kết khôi phục</span>}
                </button>

                <div className="login-footer">
                  <p><button type="button" onClick={() => setMode('login')} style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: '0.9rem', cursor: 'pointer', fontWeight: 600 }}>Quay lại đăng nhập</button></p>
                </div>
              </form>
            )}

            {mode === 'reset' && (
              <form onSubmit={handleReset}>
                <div className="login-field">
                  <label>Mật khẩu mới</label>
                  <div className="input-wrapper">
                    <KeyRound size={18} className="input-icon" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="newPassword"
                      placeholder="Nhập mật khẩu mới"
                      value={formData.newPassword}
                      onChange={handleChange}
                      required
                      autoFocus
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
                  {loading ? <span className="login-spinner"></span> : <span>Xác nhận đổi mật khẩu</span>}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
