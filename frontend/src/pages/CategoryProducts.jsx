import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import * as productService from '../services/productService'
import { getImageUrl } from '../utils/url'
import Loader from '../components/common/Loader'
import { ArrowLeft, Package, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react'
import '../styles/Categories.css'

export default function CategoryProducts() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [category, setCategory] = useState(null)
  
  // Products and Filter State
  const [products, setProducts] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [error, setError] = useState(null)
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [hasNextPage, setHasNextPage] = useState(false)
  const ITEMS_PER_PAGE = 30
  const [showSupplierDropdown, setShowSupplierDropdown] = useState(false)
  const [filters, setFilters] = useState({
    search: '',
    minPrice: '',
    maxPrice: '',
    supplierName: ''
  })
  
  const fetchProductsTimeout = useRef(null)

  useEffect(() => {
    productService.getCategory(id).then(setCategory).catch(e => setError(e.message))
    productService.getSuppliers().then(setSuppliers).catch(console.error)
  }, [id])

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setCurrentPage(0)
  }

  const fetchProducts = useCallback(async (page = 0, currentFilters = filters) => {
    try {
      setLoadingProducts(true)
      const data = await productService.getProducts({
        skip: page * ITEMS_PER_PAGE,
        limit: ITEMS_PER_PAGE + 1,
        ID_danhmuc: id,
        search: currentFilters.search || undefined,
        min_price: currentFilters.minPrice || undefined,
        max_price: currentFilters.maxPrice || undefined,
        supplier_name: currentFilters.supplierName || undefined
      })
      if (data.length > ITEMS_PER_PAGE) {
        setHasNextPage(true)
        setProducts(data.slice(0, ITEMS_PER_PAGE))
      } else {
        setHasNextPage(false)
        setProducts(data)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingProducts(false)
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    if (fetchProductsTimeout.current) clearTimeout(fetchProductsTimeout.current)
    fetchProductsTimeout.current = setTimeout(() => {
      fetchProducts(currentPage, filters)
    }, 500)
    return () => clearTimeout(fetchProductsTimeout.current)
  }, [filters, currentPage, fetchProducts])

  const formatPrice = (p) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p)
  }

  if (loading) return (
    <div className="categories-loading"><Loader /></div>
  )

  if (error) return (
    <div className="categories-error">
      <p>Đã xảy ra lỗi: {error}</p>
      <button className="btn btn-secondary" onClick={() => window.location.reload()}>Thử lại</button>
    </div>
  )

  return (
    <div className="category-products-page">
      <div className="category-products-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <Link to="/categories" className="back-link">
            <ArrowLeft size={18} />
            <span>Quay lại danh mục</span>
          </Link>
          <h1 style={{ marginTop: '0.5rem', marginBottom: '0.5rem' }}>{category?.tenDanhMuc || 'Danh mục'}</h1>
          {category?.mota && <p className="category-products-desc">{category.mota}</p>}
        </div>
        <button className="btn btn-secondary" onClick={() => setShowFilters(!showFilters)}>
          <Filter size={18} /> Lọc sản phẩm
        </button>
      </div>

      {showFilters && (
          <div className="filter-panel glass-card" style={{ padding: '1.5rem', marginBottom: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            <div className="form-group">
              <label style={{ fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>Tìm kiếm sản phẩm</label>
              <div style={{ position: 'relative' }}>
                <input type="text" className="form-control" placeholder="Tên sản phẩm..." value={filters.search} onChange={e => handleFilterChange('search', e.target.value)} />
                <Search size={16} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              </div>
            </div>
            
            <div className="form-group">
              <label style={{ fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>Nhà cung cấp</label>
              <div style={{ position: 'relative' }}>
                <input type="text" className="form-control" placeholder="Tìm nhà cung cấp..." value={filters.supplierName} 
                  onChange={e => { handleFilterChange('supplierName', e.target.value); setShowSupplierDropdown(true) }}
                  onFocus={() => setShowSupplierDropdown(true)}
                  onBlur={() => setTimeout(() => setShowSupplierDropdown(false), 200)}
                />
                {showSupplierDropdown && (
                  <div className="autocomplete-dropdown" style={{ maxHeight: '180px', overflowY: 'auto' }}>
                    {suppliers.filter(s => s.tenNhaCungCap.toLowerCase().includes(filters.supplierName.toLowerCase())).map(s => (
                      <div key={s.ID_NhaCungCap} className="autocomplete-item" onClick={() => handleFilterChange('supplierName', s.tenNhaCungCap)}>
                        {s.tenNhaCungCap}
                      </div>
                    ))}
                    {suppliers.filter(s => s.tenNhaCungCap.toLowerCase().includes(filters.supplierName.toLowerCase())).length === 0 && (
                      <div className="autocomplete-item" style={{ color: '#94a3b8' }}>Không tìm thấy</div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="form-group">
              <label style={{ fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>Khoảng giá (VNĐ)</label>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <input type="number" className="form-control" placeholder="Từ..." value={filters.minPrice} onChange={e => handleFilterChange('minPrice', e.target.value)} />
                <span style={{ display: 'flex', alignItems: 'center', color: '#94a3b8' }}>-</span>
                <input type="number" className="form-control" placeholder="Đến..." value={filters.maxPrice} onChange={e => handleFilterChange('maxPrice', e.target.value)} />
              </div>
            </div>
          </div>
      )}

      {loadingProducts ? (
         <div style={{ padding: '3rem', textAlign: 'center' }}><Loader /></div>
      ) : products.length === 0 ? (
         <div className="categories-empty">
           <Package size={64} className="empty-icon" />
           <p>Không tìm thấy sản phẩm phù hợp.</p>
           <Link to="/categories" className="btn btn-secondary">Quay lại danh mục</Link>
         </div>
      ) : (
        <div className="category-products-grid">
          {products.map((product) => {
            const name = product.tenSP || product.name
            const price = product.gia || product.price
            const pid = product.ID_sanpham || product.id
            const imageUrl = getImageUrl(product.HinhAnh_url || product.image_url)

            return (
              <div
                key={pid}
                className="category-product-card"
                onClick={() => navigate(`/products/${pid}`)}
              >
                <div className="cat-product-image">
                  <img src={imageUrl} alt={name} loading="lazy" />
                </div>
                <div className="cat-product-info">
                  <h3 className="cat-product-name">{name}</h3>
                  <p className="cat-product-price">{formatPrice(price)}</p>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {(currentPage > 0 || hasNextPage) && !loadingProducts && (
         <div className="pagination-controls" style={{ marginTop: '3rem', display: 'flex', justifyContent: 'center', gap: '1.5rem', alignItems: 'center' }}>
           <button className="btn btn-secondary" disabled={currentPage === 0} onClick={() => setCurrentPage(p => Math.max(0, p - 1))}>
             <ChevronLeft size={18} /> Trước
           </button>
           <span style={{ fontWeight: 600 }}>Trang {currentPage + 1}</span>
           <button className="btn btn-secondary" disabled={!hasNextPage} onClick={() => setCurrentPage(p => p + 1)}>
             Sau <ChevronRight size={18} />
           </button>
         </div>
      )}
    </div>
  )
}
