import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <h1>Khám phá Công nghệ Mới</h1>
          <p>Nâng tầm trải nghiệm của bạn với những thiết bị điện tử hàng đầu từ ESale.</p>
          
          <form onSubmit={handleSearch} className="search-bar-hero">
            <input 
              type="text" 
              placeholder="Tìm kiếm sản phẩm công nghệ..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="btn-primary">Tìm kiếm</button>
          </form>

          <div className="hero-actions">
            <button className="btn-secondary" onClick={() => navigate('/products')}>Xem tất cả sản phẩm</button>
          </div>
        </div>
      </section>

      <section className="featured">
        <div className="section-header">
          <h2>Sản phẩm Nổi bật</h2>
          <p>Những lựa chọn tốt nhất dành cho bạn</p>
        </div>
        <div className="featured-grid">
          {/* Featured products will go here */}
          <div className="placeholder-card">
            Đang cập nhật sản phẩm mới nhất...
          </div>
        </div>
      </section>
    </div>
  )
}
