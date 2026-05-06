import { Link } from 'react-router-dom'
import { ShoppingCart, Eye, Trash2 } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import * as productService from '../../services/productService'
import '../../styles/ProductCard.css'

export default function ProductCard({ product, onDelete }) {
  const { user } = useAuth()
  // Map database fields to display names
  const name = product.tenSP || product.name
  const price = product.gia || product.price
  const id = product.ID_sanpham || product.id
  const imageUrl = product.HinhAnh_url || product.image_url

  const formatPrice = (p) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p)
  }

  const handleDelete = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (window.confirm(`Bạn có chắc chắn muốn xóa "${name}"?`)) {
      try {
        await productService.deleteProduct(id)
        if (onDelete) onDelete(id)
        else alert('Đã xóa sản phẩm thành công! Vui lòng tải lại trang.')
      } catch (err) {
        alert('Lỗi khi xóa sản phẩm: ' + (err.response?.data?.detail || err.message))
      }
    }
  }

  return (
    <div className="product-card card">
      <div className="product-image">
        <img src={imageUrl} alt={name} loading="lazy" />
        <div className="product-badge">Mới</div>
        <div className="product-overlay">
          <Link to={`/products/${id}`} className="btn-icon" title="Xem chi tiết">
            <Eye size={20} />
          </Link>
          <button className="btn-icon" title="Thêm vào giỏ hàng">
            <ShoppingCart size={20} />
          </button>
          {user?.is_admin && (
            <button className="btn-icon btn-danger-icon" onClick={handleDelete} title="Xóa sản phẩm">
              <Trash2 size={20} />
            </button>
          )}
        </div>
      </div>
      <div className="product-info">
        <div className="product-category">Điện tử</div>
        <h3 className="product-title">{name}</h3>
        <p className="product-price">{formatPrice(price)}</p>
        <div className="product-actions">
          <Link to={`/products/${id}`} className="btn btn-secondary w-full">Chi tiết</Link>
        </div>
      </div>
    </div>
  )
}
