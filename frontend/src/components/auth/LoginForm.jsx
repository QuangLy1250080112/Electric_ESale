import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as authService from '../../services/authService'
import { useAuthStore } from '../../store/authStore'

export default function LoginForm() {
  const [formData, setFormData] = useState({ tenTK: '', matkhau: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { setUser, setToken } = useAuthStore()
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
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
    <form onSubmit={handleSubmit} className="login-form">
      <h2>Đăng nhập</h2>
      {error && <div className="error-message">{error}</div>}

      <div className="form-group">
        <label>Tên tài khoản</label>
        <input
          type="text"
          name="tenTK"
          placeholder="admin hoặc guest"
          value={formData.tenTK}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Mật khẩu</label>
        <input
          type="password"
          name="matkhau"
          placeholder="123"
          value={formData.matkhau}
          onChange={handleChange}
          required
        />
      </div>

      <button type="submit" disabled={loading} className="btn-primary">
        {loading ? 'Đang xử lý...' : 'Đăng nhập'}
      </button>
    </form>
  )
}
