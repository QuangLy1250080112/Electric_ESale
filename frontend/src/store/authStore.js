import { create } from 'zustand'
import { useCartStore } from './cartStore'

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('access_token'),
  isLoggedIn: !!localStorage.getItem('access_token'),

  setUser: (user) => set({ user }),
  setToken: (token) => {
    if (token) {
      localStorage.setItem('access_token', token)
    } else {
      localStorage.removeItem('access_token')
    }
    set({ token, isLoggedIn: !!token })
    
    // Fetch cart right after login
    if (token) {
      useCartStore.getState().fetchCart()
    }
  },
  logout: () => {
    localStorage.removeItem('access_token')
    set({ user: null, token: null, isLoggedIn: false })
    // Clear cart locally on logout
    useCartStore.getState().clearCartLocal()
  },
}))
