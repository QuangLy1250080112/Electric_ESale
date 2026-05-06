import api from './api'

// Register user
export const register = async (userData) => {
  const response = await api.post('/v1/auth/register', userData)
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
