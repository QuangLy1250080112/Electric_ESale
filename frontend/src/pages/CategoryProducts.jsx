import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import * as productService from '../services/productService'
import { getImageUrl } from '../utils/url'
import Loader from '../components/common/Loader'
import { ArrowLeft, Package } from 'lucide-react'
import '../styles/Categories.css'

export default function CategoryProducts() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [category, setCategory] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [catData, productsData] = await Promise.all([
          productService.getCategory(id),
          productService.getCategoryProducts(id),
        ])
        setCategory(catData)
        setProducts(productsData)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

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
      <div className="category-products-header">
        <Link to="/categories" className="back-link">
          <ArrowLeft size={18} />
          <span>Quay lại danh mục</span>
        </Link>
        <h1>{category?.tenDanhMuc || 'Danh mục'}</h1>
        {category?.mota && <p className="category-products-desc">{category.mota}</p>}
        <div className="category-products-count">
          <Package size={16} />
          <span>{products.length} sản phẩm</span>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="categories-empty">
          <Package size={64} className="empty-icon" />
          <p>Chưa có sản phẩm nào trong danh mục này.</p>
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
    </div>
  )
}
