import { useState, useEffect } from 'react'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import * as authService from '../services/authService'
import { useAuthStore } from '../store/authStore'
import { UserPlus, User, Lock, Eye, EyeOff, Package, Mail } from 'lucide-react'
import '../styles/Login.css'

export default function Register() {
  const [searchParams] = useSearchParams()
  const registerToken = searchParams.get('token')
  
  const [formData, setFormData] = useState({ email: '', tenTK: '', matkhau: '', confirmMatkhau: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  
  // mode: 'request' (email only), 'complete' (username, password with token)
  const [mode, setMode] = useState(registerToken ? 'complete' : 'request') 
  const { setUser, setToken } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (registerToken) {
      setMode('complete')
    }
  }, [registerToken])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (error) setError('')
    if (success) setSuccess('')
  }

  const handleRequest = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      await authService.requestRegister(formData.email)
      setSuccess('Đã gửi email xác thực. Vui lòng kiểm tra hộp thư của bạn để tiếp tục.')
      setFormData(prev => ({...prev, email: ''}))
    } catch (err) {
      setError(err.response?.data?.detail || 'Có lỗi xảy ra')
    } finally {
      setLoading(false)
    }
  }

  const handleComplete = async (e) => {
    e.preventDefault()
    if (formData.matkhau !== formData.confirmMatkhau) {
      setError('Mật khẩu xác nhận không khớp')
      return
    }
    
    try {
      setLoading(true)
      const data = await authService.register({
        token: registerToken,
        tenTK: formData.tenTK,
        matkhau: formData.matkhau
      })
      setToken(data.access_token)
      setUser(data.user)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.detail || 'Token không hợp lệ hoặc đã hết hạn')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page-wrapper">
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
            <p>Khởi đầu hành trình mua sắm tuyệt vời cùng chúng tôi</p>
            <div className="branding-features">
              <div className="feature-item">
                <span className="feature-dot"></span>
                <span>Hàng ngàn sản phẩm chất lượng</span>
              </div>
              <div className="feature-item">
                <span className="feature-dot"></span>
                <span>Ưu đãi dành riêng cho thành viên mới</span>
              </div>
              <div className="feature-item">
                <span className="feature-dot"></span>
                <span>Hỗ trợ khách hàng 24/7</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="login-form-section">
          <div className="login-form-modern">
            <div className="form-header">
              <h2>
                {mode === 'request' ? 'Đăng ký tài khoản' : 'Hoàn tất đăng ký'}
              </h2>
              <p>
                {mode === 'request' ? 'Vui lòng nhập email để bắt đầu' : 'Tạo tên đăng nhập và mật khẩu'}
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

            {mode === 'request' && (
              <form onSubmit={handleRequest}>
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
                  {loading ? <span className="login-spinner"></span> : <span>Gửi mã xác thực</span>}
                </button>

                <div className="login-footer">
                  <p>Đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link></p>
                </div>
              </form>
            )}

            {mode === 'complete' && (
              <form onSubmit={handleComplete}>
                <div className="login-field">
                  <label>Tên đăng nhập</label>
                  <div className="input-wrapper">
                    <User size={18} className="input-icon" />
                    <input
                      type="text"
                      name="tenTK"
                      placeholder="Chọn tên đăng nhập"
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
                      placeholder="Tạo mật khẩu"
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

                <div className="login-field">
                  <label>Xác nhận mật khẩu</label>
                  <div className="input-wrapper">
                    <Lock size={18} className="input-icon" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="confirmMatkhau"
                      placeholder="Nhập lại mật khẩu"
                      value={formData.confirmMatkhau}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <button type="submit" disabled={loading} className="login-submit-btn">
                  {loading ? (
                    <span className="login-spinner"></span>
                  ) : (
                    <>
                      <UserPlus size={20} />
                      <span>Hoàn tất đăng ký</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
