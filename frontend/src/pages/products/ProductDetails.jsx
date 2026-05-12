import { useState, useRef, useEffect } from 'react'
import { useCart } from '../../hooks/useCart'
import { useAuth } from '../../hooks/useAuth'
import { Trash2, Edit2, Check, X, Upload, Star } from 'lucide-react'
import * as productService from '../../services/productService'
import * as orderService from '../../services/orderService'
import { useNavigate } from 'react-router-dom'
import { getImageUrl } from '../../utils/url'
import '../../styles/ProductDetails.css'

export default function ProductDetails({ product, onUpdate }) {
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  // Edit Mode State
  const [isEditMode, setIsEditMode] = useState(false)
  const [editData, setEditData] = useState({})
  const [loading, setLoading] = useState(false)
  const [productImages, setProductImages] = useState([])
  const fileInputRef = useRef(null)

  // Reviews State
  const [reviews, setReviews] = useState([])
  const [reviewsLoading, setReviewsLoading] = useState(false)

  useEffect(() => {
    if (product) {
      setEditData({
        tenSP: product.tenSP,
        gia: product.gia,
        mota: product.mota,
        soluong: product.soluong || 0
      })
      fetchImages()
      fetchReviews()
    }
  }, [product])

  const fetchImages = async () => {
    try {
      const response = await productService.api.get(`/v1/products/${product.ID_sanpham}/images`)
      setProductImages(response.data)
    } catch (error) {
      console.error('Failed to fetch images')
    }
  }

  const fetchReviews = async () => {
    setReviewsLoading(true)
    try {
      const data = await orderService.getProductReviews(product.ID_sanpham)
      setReviews(data)
    } catch (error) {
      console.error('Failed to fetch reviews')
    } finally {
      setReviewsLoading(false)
    }
  }

  const name = product.tenSP || product.name
  const price = product.gia || product.price
  const description = product.mota || product.description
  const imageUrl = getImageUrl(product.HinhAnh_url || product.image_url)
  const id = product.ID_sanpham || product.id
  const remainingStock = product.soluong || 0

  const formatPrice = (p) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p)
  }

  const handleAddToCart = async () => {
    if (quantity > remainingStock) {
      alert('Số lượng trong kho không đủ!')
      return
    }
    
    setLoading(true)
    try {
      // Pass quantity as separate argument to addItem
      addItem({ name, price, id, HinhAnh_url: product.HinhAnh_url, image_url: product.image_url }, quantity)
      
      alert('Đã thêm vào giỏ hàng thành công!')
      if (onUpdate) onUpdate() // Reload product data
    } catch (err) {
      alert('Lỗi khi thêm vào giỏ hàng: ' + (err?.message || ''))
    } finally {
      setLoading(false)
      setQuantity(1)
    }
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

  const handleSaveEdit = async () => {
    setLoading(true)
    try {
      await productService.updateProduct(id, {
        tenSP: editData.tenSP,
        gia: parseFloat(editData.gia),
        mota: editData.mota,
        soluong: parseInt(editData.soluong)
      })
      setIsEditMode(false)
      alert('Đã lưu thay đổi!')
      if (onUpdate) onUpdate()
    } catch (error) {
      alert('Lỗi khi lưu: ' + (error.response?.data?.detail || error.message))
    } finally {
      setLoading(false)
    }
  }

  const handleImageDelete = async (imageId) => {
    if (window.confirm('Xóa ảnh này?')) {
      try {
        await productService.deleteProductImage(imageId)
        fetchImages()
        if (onUpdate) onUpdate()
      } catch (err) {
        alert('Lỗi khi xóa ảnh')
      }
    }
  }

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return
    setLoading(true)
    try {
      for (const file of files) {
        await productService.addProductImage(id, file)
      }
      fetchImages()
      if (onUpdate) onUpdate()
    } catch (err) {
      alert('Lỗi khi tải ảnh lên')
    } finally {
      setLoading(false)
    }
  }

  // Compute average rating
  const avgRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) 
    : 0

  return (
    <>
      <div className="product-details-container animate-fade-in">
        <div className="product-image-large">
          <img src={imageUrl} alt={name} />
          
          {isEditMode && (
            <div className="edit-images-section mt-4" style={{borderTop: '1px solid #e2e8f0', paddingTop: '1rem'}}>
              <h4>Quản lý hình ảnh</h4>
              <div className="admin-image-grid" style={{display: 'flex', gap: '0.5rem', flexWrap: 'wrap'}}>
                {productImages.map(img => (
                  <div key={img.ID_HinhAnh} style={{position: 'relative', width: '80px', height: '80px'}}>
                    <img src={getImageUrl(img.HinhAnh_url)} style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px'}} />
                    <button 
                      onClick={() => handleImageDelete(img.ID_HinhAnh)}
                      style={{position: 'absolute', top: 0, right: 0, background: 'rgba(239,68,68,0.8)', color: 'white', border: 'none', borderRadius: '50%', padding: '2px', cursor: 'pointer'}}
                    ><X size={12} /></button>
                  </div>
                ))}
                <button 
                  onClick={() => fileInputRef.current.click()}
                  style={{width: '80px', height: '80px', border: '2px dashed #cbd5e1', background: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}
                >
                  <Upload size={20} color="#94a3b8" />
                </button>
                <input type="file" ref={fileInputRef} onChange={handleImageUpload} multiple accept="image/*" style={{display: 'none'}} />
              </div>
            </div>
          )}
        </div>

        <div className="details-info" style={{position: 'relative'}}>
          {user?.is_admin && !isEditMode && (
            <button onClick={() => setIsEditMode(true)} className="btn btn-secondary" style={{position: 'absolute', top: 0, right: 0, display: 'flex', gap: '0.5rem', alignItems: 'center'}}>
              <Edit2 size={16} /> Chỉnh sửa
            </button>
          )}

          {isEditMode ? (
            <div className="edit-form" style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              <div>
                <label>Tên sản phẩm</label>
                <input className="form-control" value={editData.tenSP} onChange={e=>setEditData({...editData, tenSP: e.target.value})} />
              </div>
              <div>
                <label>Giá (VNĐ)</label>
                <input className="form-control" type="number" value={editData.gia} onChange={e=>setEditData({...editData, gia: e.target.value})} />
              </div>
              <div>
                <label>Số lượng còn (Kho)</label>
                <input className="form-control" type="number" value={editData.soluong} onChange={e=>setEditData({...editData, soluong: e.target.value})} />
              </div>
              <div>
                <label>Mô tả</label>
                <textarea className="form-control" rows="4" value={editData.mota} onChange={e=>setEditData({...editData, mota: e.target.value})} />
              </div>
              
              <div style={{display: 'flex', gap: '0.5rem', marginTop: '1rem'}}>
                <button className="btn btn-primary" onClick={handleSaveEdit} disabled={loading}>
                  <Check size={16} /> Xác nhận chỉnh sửa
                </button>
                <button className="btn btn-secondary" onClick={() => setIsEditMode(false)}>Hủy</button>
                <button className="btn btn-danger ml-auto" onClick={handleDelete}><Trash2 size={16} /> Xóa sản phẩm</button>
              </div>
            </div>
          ) : (
            <>
              <h1 className="product-title-large">{name}</h1>
              <p className="product-price-large">{formatPrice(price)}</p>
              
              <div className="product-meta" style={{display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem'}}>
                <span className="badge badge-primary">Mới</span>
                <span style={{color: remainingStock > 0 ? '#059669' : '#dc2626', fontWeight: '600'}}>
                  {remainingStock > 0 ? `Còn hàng (${remainingStock} sản phẩm)` : 'Hết hàng'}
                </span>
                {reviews.length > 0 && (
                  <span style={{display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#f59e0b'}}>
                    <Star size={16} fill="#f59e0b" />
                    <strong>{avgRating}</strong>
                    <span style={{color: '#94a3b8', fontSize: '0.85rem'}}>({reviews.length} đánh giá)</span>
                  </span>
                )}
              </div>
              
              <div className="description-section">
                <h3>Mô tả sản phẩm</h3>
                <p className="description-text">{description || 'Chưa có mô tả cho sản phẩm này.'}</p>
              </div>

              <div className="actions-section">
                <div className="quantity-selector">
                  <label>Số lượng muốn mua:</label>
                  <input
                    type="number"
                    min="1"
                    max={remainingStock > 0 ? remainingStock : 1}
                    value={quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value)
                      setQuantity(isNaN(val) || val < 1 ? 1 : val)
                    }}
                    className="form-control"
                    disabled={remainingStock <= 0}
                  />
                </div>
                
                <div className="button-group">
                  <button 
                    onClick={handleAddToCart} 
                    className="btn btn-primary btn-lg flex-grow-1"
                    disabled={remainingStock <= 0 || loading}
                  >
                    {remainingStock <= 0 ? 'Tạm hết hàng' : (loading ? 'Đang xử lý...' : 'Thêm vào giỏ hàng')}
                  </button>
                  
                  {user?.is_admin && (
                    <button onClick={handleDelete} className="btn btn-danger btn-lg" title="Xóa sản phẩm">
                      <Trash2 size={20} />
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="reviews-section animate-fade-in">
        <div className="reviews-header">
          <h2>Đánh giá sản phẩm</h2>
          {reviews.length > 0 && (
            <div className="reviews-summary">
              <div className="avg-rating">
                <span className="avg-rating-number">{avgRating}</span>
                <div className="stars-display">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} size={20} fill={s <= Math.round(avgRating) ? '#f59e0b' : 'transparent'} color={s <= Math.round(avgRating) ? '#f59e0b' : '#d1d5db'} />
                  ))}
                </div>
                <span className="review-count">{reviews.length} đánh giá</span>
              </div>
            </div>
          )}
        </div>
        
        {reviewsLoading ? (
          <p style={{textAlign: 'center', color: '#94a3b8', padding: '2rem'}}>Đang tải đánh giá...</p>
        ) : reviews.length === 0 ? (
          <div className="no-reviews">
            <Star size={40} color="#d1d5db" />
            <p>Chưa có đánh giá nào cho sản phẩm này</p>
          </div>
        ) : (
          <div className="reviews-list">
            {reviews.map(review => (
              <ReviewCard key={review.ID_review} review={review} />
            ))}
          </div>
        )}
      </div>
    </>
  )
}

function ReviewCard({ review }) {
  const [showFullImages, setShowFullImages] = useState(false)
  const imageUrls = review.image_url ? review.image_url.split(',').filter(Boolean) : []

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  return (
    <div className="review-card">
      <div className="review-card-header">
        <div className="review-user-info">
          <span className="review-date">{formatDate(review.thoigiantao)}</span>
          <span className="review-username">{review.tenTK}</span>
        </div>
        <div className="review-stars">
          {[1,2,3,4,5].map(s => (
            <Star key={s} size={16} fill={s <= review.rating ? '#f59e0b' : 'transparent'} color={s <= review.rating ? '#f59e0b' : '#d1d5db'} />
          ))}
        </div>
      </div>
      
      {review.comment && (
        <p className="review-comment">{review.comment}</p>
      )}

      {imageUrls.length > 0 && (
        <div className="review-images">
          {imageUrls.map((url, idx) => (
            <img 
              key={idx} 
              src={`http://localhost:5173${url}`} 
              alt={`Review ${idx + 1}`}
              className="review-image"
              onClick={() => setShowFullImages(true)}
            />
          ))}
        </div>
      )}

      {showFullImages && imageUrls.length > 0 && (
        <div className="review-lightbox" onClick={() => setShowFullImages(false)}>
          <div className="lightbox-content" onClick={e => e.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setShowFullImages(false)}><X size={24} /></button>
            {imageUrls.map((url, idx) => (
              <img key={idx} src={`http://localhost:5173${url}`} alt={`Review full ${idx + 1}`} className="lightbox-image" />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
