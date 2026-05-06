import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, ShoppingBag, ArrowRight } from 'lucide-react'

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
      <section className="hero card">
        <div className="hero-content">
          <h1>Nâng tầm Công nghệ, <br />Vươn xa Trải nghiệm</h1>
          <p>Khám phá bộ sưu tập thiết bị điện tử hàng đầu với công nghệ tiên tiến nhất tại ESale.</p>
          
          <form onSubmit={handleSearch} className="search-bar-hero">
            <input 
              type="text" 
              placeholder="Bạn đang tìm kiếm sản phẩm nào?" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">
              <Search size={18} />
              <span>Tìm kiếm</span>
            </button>
          </form>

          <div className="hero-actions">
            <button className="btn btn-secondary" onClick={() => navigate('/products')}>
              <ShoppingBag size={18} />
              <span>Mua sắm ngay</span>
            </button>
            <button className="btn" style={{color: 'var(--primary)'}} onClick={() => navigate('/about')}>
              <span>Tìm hiểu thêm</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      <section className="featured mt-4">
        <div className="section-header">
          <h2>Sản phẩm Nổi bật</h2>
          <p>Những thiết bị được yêu thích nhất trong tuần qua</p>
        </div>
        <div className="featured-grid">
          <div className="placeholder-card card">
            <p>Danh sách sản phẩm nổi bật đang được cập nhật...</p>
          </div>
        </div>
      </section>
    </div>
  )
}
