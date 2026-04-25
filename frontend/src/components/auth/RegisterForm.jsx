import { useState } from 'react'
import * as authService from '../../services/authService'
import { useAuthStore } from '../../store/authStore'

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    full_name: '',
    password: '',
    password_confirm: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { setUser, setToken } = useAuthStore()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.password !== formData.password_confirm) {
      setError('Passwords do not match')
      return
    }

    try {
      setLoading(true)
      const data = await authService.register({
        email: formData.email,
        username: formData.username,
        full_name: formData.full_name,
        password: formData.password,
      })
      setToken(data.access_token)
      setUser(data.user)
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="register-form">
      <h2>Register</h2>
      {error && <div className="error-message">{error}</div>}

      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Username</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Full Name</label>
        <input
          type="text"
          name="full_name"
          value={formData.full_name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Confirm Password</label>
        <input
          type="password"
          name="password_confirm"
          value={formData.password_confirm}
          onChange={handleChange}
          required
        />
      </div>

      <button type="submit" disabled={loading} className="btn-primary">
        {loading ? 'Loading...' : 'Register'}
      </button>
    </form>
  )
}
