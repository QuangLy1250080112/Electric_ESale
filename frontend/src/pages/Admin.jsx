import { useState, useRef } from 'react'
import { Plus, Package, List, Users, ShoppingCart, Upload, X } from 'lucide-react'
import * as productService from '../services/productService'
import '../styles/Admin.css'

export default function Admin() {
  const [activeTab, setActiveTab] = useState('add-product')
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
      for (const img of images) {
        // Simulated URL for now
        const simulatedUrl = `https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop`
        await productService.addProductImage(product.ID_sanpham, simulatedUrl)
      }

      alert('Thêm sản phẩm thành công!')
      setFormData({
        tenSP: '',
        mota: '',
        gia: '',
        ID_danhmuc: 1,
        supplier_ID: 1
      })
      setImages([])
      setPreviews([])
    } catch (err) {
      alert('Lỗi: ' + (err.response?.data?.detail || 'Không thể thêm sản phẩm'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-page">
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <h2>Quản trị hệ thống</h2>
        </div>
        <nav className="sidebar-nav">
          <button 
            className={`sidebar-link ${activeTab === 'add-product' ? 'active' : ''}`}
            onClick={() => setActiveTab('add-product')}
          >
            <Plus size={20} />
            <span>Thêm sản phẩm</span>
          </button>
          <button 
            className={`sidebar-link ${activeTab === 'manage-products' ? 'active' : ''}`}
            onClick={() => setActiveTab('manage-products')}
          >
            <Package size={20} />
            <span>Quản lý sản phẩm</span>
          </button>
          <button 
            className={`sidebar-link ${activeTab === 'categories' ? 'active' : ''}`}
            onClick={() => setActiveTab('categories')}
          >
            <List size={20} />
            <span>Danh mục</span>
          </button>
          <button 
            className={`sidebar-link ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <Users size={20} />
            <span>Người dùng</span>
          </button>
        </nav>
      </aside>

      <main className="admin-content-area">
        {activeTab === 'add-product' && (
          <div className="admin-card card animate-fade-in">
            <div className="card-header">
              <h3>Thêm sản phẩm mới</h3>
              <p>Nhập các thông tin chi tiết để thêm sản phẩm vào hệ thống</p>
            </div>
            
            <form onSubmit={handleSubmit} className="admin-form">
              <div className="form-grid">
                <div className="form-group full-width">
                  <label className="form-label">Tên sản phẩm</label>
                  <input 
                    className="form-control"
                    type="text" 
                    value={formData.tenSP} 
                    onChange={(e) => setFormData({...formData, tenSP: e.target.value})}
                    placeholder="Ví dụ: iPhone 15 Pro Max"
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
                    <option value={4}>Máy tính bảng</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Nhà cung cấp ID</label>
                  <input 
                    className="form-control"
                    type="number" 
                    value={formData.supplier_ID} 
                    onChange={(e) => setFormData({...formData, supplier_ID: parseInt(e.target.value)})}
                    required 
                  />
                </div>

                <div className="form-group full-width">
                  <label className="form-label">Mô tả chi tiết</label>
                  <textarea 
                    className="form-control"
                    rows="4"
                    value={formData.mota} 
                    onChange={(e) => setFormData({...formData, mota: e.target.value})}
                    placeholder="Thông tin chi tiết về sản phẩm..."
                  />
                </div>
              </div>

              <div className="image-upload-section mt-4">
                <label className="form-label">Hình ảnh sản phẩm (Có thể chọn nhiều)</label>
                <div className="admin-image-grid">
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
                    <Upload size={24} />
                    <span>Tải ảnh lên</span>
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

              <div className="form-actions mt-4">
                <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                  {loading ? 'Đang xử lý...' : 'Xác nhận thêm sản phẩm'}
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab !== 'add-product' && (
          <div className="placeholder-content">
            <div className="placeholder-card card">
              <Package size={48} className="text-muted mb-4" />
              <h3>Tính năng đang phát triển</h3>
              <p>Mục <strong>{activeTab}</strong> sẽ sớm ra mắt.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
