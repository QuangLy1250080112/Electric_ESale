import { useState } from 'react'
import { useCart } from '../../hooks/useCart'
import { useAuth } from '../../hooks/useAuth'
import { Trash2 } from 'lucide-react'
import * as productService from '../../services/productService'
import { useNavigate } from 'react-router-dom'
import { getImageUrl } from '../../utils/url'
import '../../styles/ProductDetails.css'

export default function ProductDetails({ product }) {
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const name = product.tenSP || product.name
  const price = product.gia || product.price
  const description = product.mota || product.description
  const imageUrl = getImageUrl(product.HinhAnh_url || product.image_url)
  const id = product.ID_sanpham || product.id

  const formatPrice = (p) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p)
  }

  const handleAddToCart = () => {
    addItem({ ...product, quantity, name, price, id })
  }

  const handleDelete = async () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      try {
        await productService.deleteProduct(id)
        alert('Đã xóa sản phẩm thành công!')
        navigate('/products')
      } catch (err) {
        alert('Lỗi khi xóa sản phẩm: ' + (err.response?.data?.detail || err.message))
      }
    }
  }

  return (
    <div className="product-details-container animate-fade-in">
      <div className="product-image-large">
        <img src={imageUrl} alt={name} />
      </div>
      <div className="details-info">
        <h1 className="product-title-large">{name}</h1>
        <p className="product-price-large">{formatPrice(price)}</p>
        <div className="product-meta">
          <span className="badge badge-primary">Mới</span>
          <span className="text-muted ml-2">ID: {id}</span>
        </div>
        
        <div className="description-section">
          <h3>Mô tả sản phẩm</h3>
          <p className="description-text">{description || 'Chưa có mô tả cho sản phẩm này.'}</p>
        </div>

        <div className="actions-section">
          <div className="quantity-selector">
            <label>Số lượng:</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="form-control"
            />
          </div>
          
          <div className="button-group">
            <button onClick={handleAddToCart} className="btn btn-primary btn-lg flex-grow-1">
              Thêm vào giỏ hàng
            </button>
            
            {user?.is_admin && (
              <button onClick={handleDelete} className="btn btn-danger btn-lg" title="Xóa sản phẩm">
                <Trash2 size={20} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
