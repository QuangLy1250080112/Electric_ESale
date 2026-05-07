import { useState, useRef } from 'react'
import { X, Upload, Image as ImageIcon, Plus } from 'lucide-react'
import * as productService from '../../services/productService'
import '../../styles/ProductModal.css'

export default function ProductModal({ isOpen, onClose, onRefresh }) {
  const [formData, setFormData] = useState({
    tenSP: '',
    mota: '',
    gia: '',
    ID_danhmuc: 1,
    supplier_ID: 1
  })
  const [images, setImages] = useState([])
  const [previews, setPreviews] = useState([])
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef(null)

  if (!isOpen) return null

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    if (files.length > 0) {
      const newPreviews = files.map(file => URL.createObjectURL(file))
      setPreviews(prev => [...prev, ...newPreviews])
      setImages(prev => [...prev, ...files])
    }
  }

  const removeImage = (index) => {
    setPreviews(prev => prev.filter((_, i) => i !== index))
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      // 1. Create Product
      const product = await productService.addProduct({
        ...formData,
        gia: parseFloat(formData.gia)
      })

      // 2. Upload Images
      if (images.length > 0) {
        for (const imgFile of images) {
          await productService.addProductImage(product.ID_sanpham, imgFile)
        }
      }

      alert('Thêm sản phẩm thành công!')
      onRefresh()
      onClose()
    } catch (err) {
      alert('Lỗi: ' + (err.response?.data?.detail || 'Không thể thêm sản phẩm'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Thêm sản phẩm mới</h2>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-grid">
              <div className="form-group full-width">
                <label className="form-label">Tên sản phẩm</label>
                <input 
                  className="form-control"
                  type="text" 
                  value={formData.tenSP} 
                  onChange={(e) => setFormData({...formData, tenSP: e.target.value})}
                  placeholder="Nhập tên sản phẩm..."
                  required 
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Giá bán (VNĐ)</label>
                <input 
                  className="form-control"
                  type="number" 
                  value={formData.gia} 
                  onChange={(e) => setFormData({...formData, gia: e.target.value})}
                  placeholder="0.000"
                  required 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Danh mục</label>
                <select 
                  className="form-control"
                  value={formData.ID_danhmuc}
                  onChange={(e) => setFormData({...formData, ID_danhmuc: parseInt(e.target.value)})}
                >
                  <option value={1}>Điện thoại</option>
                  <option value={2}>Laptop</option>
                  <option value={3}>Phụ kiện</option>
                </select>
              </div>

              <div className="form-group full-width">
                <label className="form-label">Mô tả sản phẩm</label>
                <textarea 
                  className="form-control"
                  rows="3"
                  value={formData.mota} 
                  onChange={(e) => setFormData({...formData, mota: e.target.value})}
                  placeholder="Mô tả chi tiết về sản phẩm..."
                />
              </div>
            </div>

            <div className="image-upload-section mt-4">
              <label className="form-label">Hình ảnh sản phẩm</label>
              <div className="image-grid">
                {previews.map((src, index) => (
                  <div key={index} className="image-preview-item">
                    <img src={src} alt={`Preview ${index}`} />
                    <button type="button" className="remove-img-btn" onClick={() => removeImage(index)}>
                      <X size={12} />
                    </button>
                  </div>
                ))}
                <button 
                  type="button" 
                  className="add-image-placeholder"
                  onClick={() => fileInputRef.current.click()}
                >
                  <Plus size={24} />
                  <span>Thêm ảnh</span>
                </button>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageChange} 
                multiple 
                accept="image/*" 
                style={{ display: 'none' }} 
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Hủy bỏ</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Đang lưu...' : 'Lưu sản phẩm'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
