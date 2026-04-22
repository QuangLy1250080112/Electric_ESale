import { Outlet } from 'react-router-dom'
import Header from '../common/Header'
import Footer from '../common/Footer'

export default function MainLayout() {
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
