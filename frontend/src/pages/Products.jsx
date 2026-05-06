import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useProducts } from '../hooks/useProducts'
import { useAuthStore } from '../store/authStore'
import ProductList from '../components/products/ProductList'
import ProductModal from '../components/products/ProductModal'
import { Search, Plus, Filter } from 'lucide-react'

export default function Products() {
  const { products: allProducts, loading, error, refreshProducts } = useProducts()
  const { user } = useAuthStore()
  const [searchParams, setSearchParams] = useSearchParams()
  
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const query = searchParams.get('search')
    if (query) setSearch(query)
  }, [searchParams])

  const filtered = allProducts.filter((p) => {
    const matchesSearch = p.tenSP.toLowerCase().includes(search.toLowerCase())
    return matchesSearch
  })

  return (
    <div className="products-page">
      <div className="products-header">
        <div className="header-text">
          <h1>Danh sách Sản phẩm</h1>
          <p>Khám phá bộ sưu tập thiết bị điện tử mới nhất</p>
        </div>
        
        {user?.is_admin && (
          <button 
            className="btn btn-primary" 
            onClick={() => setIsModalOpen(true)}
          >
            <Plus size={18} />
            <span>Thêm sản phẩm</span>
          </button>
        )}
      </div>

      <div className="products-toolbar">
        <div className="search-box">
          <div className="search-input-wrapper">
            <Search size={18} className="search-icon" />
            <input
              className="form-control"
              type="text"
              placeholder="Tìm kiếm theo tên sản phẩm..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setSearchParams({ search: e.target.value })
              }}
            />
          </div>
        </div>
        <button className="btn btn-secondary">
          <Filter size={18} />
          <span>Lọc</span>
        </button>
      </div>

      <div className="products-content">
        <div className="results-count mb-4">
          Tìm thấy <strong>{filtered.length}</strong> sản phẩm phù hợp
        </div>
        <ProductList products={filtered} loading={loading} error={error} />
      </div>

      <ProductModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onRefresh={refreshProducts}
      />
    </div>
  )
}
