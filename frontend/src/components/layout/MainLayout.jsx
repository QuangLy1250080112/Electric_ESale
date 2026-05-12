import { Outlet } from 'react-router-dom'
import { useEffect } from 'react'
import Header from '../common/Header'
import Footer from '../common/Footer'
import { useCartStore } from '../../store/cartStore'
import { useAuthStore } from '../../store/authStore'

export default function MainLayout() {
  const { fetchCart } = useCartStore()
  const { isLoggedIn } = useAuthStore()

  useEffect(() => {
    if (isLoggedIn) {
      fetchCart()
    }
  }, [isLoggedIn, fetchCart])

  return (
    <div className="main-layout">
      <Header />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
