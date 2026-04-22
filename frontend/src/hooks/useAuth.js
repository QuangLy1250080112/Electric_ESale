import { useState, useEffect } from 'react'
import * as authService from '../services/authService'
import { useAuthStore } from '../store/authStore'

export const useAuth = () => {
  const { user, isLoggedIn, setUser, setToken, logout } = useAuthStore()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      if (isLoggedIn) {
        try {
          setLoading(true)
          const userData = await authService.getCurrentUser()
          setUser(userData)
        } catch (error) {
          console.error('Error checking auth:', error)
          logout()
        } finally {
          setLoading(false)
        }
      }
    }

    checkAuth()
  }, [isLoggedIn])

  return { user, isLoggedIn, loading, setUser, setToken, logout }
}
