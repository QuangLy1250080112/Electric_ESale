import { Link } from 'react-router-dom'
import { ShoppingCart, Eye } from 'lucide-react'
import '../../styles/ProductCard.css'

export default function ProductCard({ product }) {
  // Map database fields to display names
  const name = product.tenSP || product.name
  const price = product.gia || product.price
  const id = product.ID_sanpham || product.id
  const imageUrl = product.HinhAnh_url || product.image_url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop'

  const formatPrice = (p) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p)
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
