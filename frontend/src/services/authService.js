import api from './api'

// Request registration email
export const requestRegister = async (email) => {
  const response = await api.post('/v1/auth/request-register', { email })
  return response.data
}

// Register user with token
export const register = async (userData) => {
  const response = await api.post('/v1/auth/register', userData)
  if (response.data.access_token) {
    localStorage.setItem('access_token', response.data.access_token)
  }
  return response.data
}

// Request forgot password email
export const forgotPassword = async (email) => {
  const response = await api.post('/v1/auth/forgot-password', { email })
  return response.data
}

// Reset password with token
export const resetPassword = async (token, new_password) => {
  const response = await api.post('/v1/auth/reset-password', { token, new_password })
  return response.data
}

// Login user
export const login = async (tenTK, matkhau) => {
  const response = await api.post('/v1/auth/login', { tenTK, matkhau })
  if (response.data.access_token) {
    localStorage.setItem('access_token', response.data.access_token)
  }
  return response.data
}
// Get current user
export const getCurrentUser = async () => {
  const response = await api.get('/v1/users/me')
  return response.data
}

// Update user profile
export const updateProfile = async (userData) => {
  const response = await api.put('/v1/users/me', userData)
  return response.data
}

// Logout
export const logout = () => {
  localStorage.removeItem('access_token')
}
