import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import * as productService from '../services/productService'
import { getImageUrl } from '../utils/url'
import Loader from '../components/common/Loader'
import { Layers, Upload, Image, ArrowRight, Plus, X } from 'lucide-react'
import '../styles/Categories.css'

export default function Categories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [uploadingId, setUploadingId] = useState(null)
  const { user } = useAuth()
  const navigate = useNavigate()

  // Add Category State
  const [showAddModal, setShowAddModal] = useState(false)
  const [newCat, setNewCat] = useState({ tenDanhMuc: '', mota: '' })
  const [newCatImage, setNewCatImage] = useState(null)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const data = await productService.getCategories()
      setCategories(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (categoryId, file) => {
    try {
      setUploadingId(categoryId)
      await productService.uploadCategoryImage(categoryId, file)
      await fetchCategories()
    } catch (err) {
      alert('Lỗi khi tải ảnh: ' + (err.response?.data?.detail || err.message))
    } finally {
      setUploadingId(null)
    }
  }

  const onFileSelect = (categoryId) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = (e) => {
      const file = e.target.files[0]
      if (file) handleImageUpload(categoryId, file)
    }
    input.click()
  }

  const handleAddCategory = async (e) => {
    e.preventDefault()
    try {
      const created = await productService.createCategory({ tenDanhMuc: newCat.tenDanhMuc, mota: newCat.mota })
      if (newCatImage) {
        await productService.uploadCategoryImage(created.ID_danhmuc, newCatImage)
      }
      setShowAddModal(false)
      setNewCat({ tenDanhMuc: '', mota: '' })
      setNewCatImage(null)
      fetchCategories()
      alert('Đã thêm danh mục thành công!')
    } catch (err) {
      alert('Lỗi khi thêm danh mục: ' + err.message)
    }
  }

  if (loading) return (
    <div className="categories-loading">
      <Loader />
    </div>
  )

  if (error) return (
    <div className="categories-error">
      <p>Đã xảy ra lỗi: {error}</p>
      <button className="btn btn-secondary" onClick={() => window.location.reload()}>Thử lại</button>
    </div>
  )

  return (
    <div className="categories-page">
      <div className="categories-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <div>
          <div className="categories-header-icon" style={{margin: 0, marginBottom: '1rem'}}>
            <Layers size={32} />
          </div>
          <h1 style={{margin: 0}}>Danh mục sản phẩm</h1>
        </div>
        {user?.is_admin && (
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)} style={{display: 'flex', gap: '0.5rem', alignItems: 'center'}}>
            <Plus size={20} /> Thêm danh mục
          </button>
        )}
      </div>

      <div className="categories-grid">
        {categories.map((cat) => (
          <div
            key={cat.ID_danhmuc}
            className="category-box"
            onClick={() => navigate(`/categories/${cat.ID_danhmuc}`)}
          >
            <div className="category-image-wrapper">
              {cat.anh_url ? (
                <img
                  src={getImageUrl(cat.anh_url)}
                  alt={cat.tenDanhMuc}
                  className="category-image"
                />
              ) : (
                <div className="category-placeholder">
                  <Image size={48} />
                </div>
              )}
              <div className="category-overlay">
                <ArrowRight size={24} />
              </div>
            </div>

            <div className="category-content">
              <h3>{cat.tenDanhMuc}</h3>
              {cat.mota && <p className="category-desc">{cat.mota}</p>}

              {user?.is_admin && (
                <button
                  className="btn btn-secondary btn-upload-cat"
                  onClick={(e) => {
                    e.stopPropagation()
                    onFileSelect(cat.ID_danhmuc)
                  }}
                  disabled={uploadingId === cat.ID_danhmuc}
                >
                  <Upload size={14} />
                  <span>{uploadingId === cat.ID_danhmuc ? 'Đang tải...' : 'Đổi ảnh'}</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="categories-empty">
          <Layers size={64} className="empty-icon" />
          <p>Chưa có danh mục nào được tạo.</p>
        </div>
      )}

      {showAddModal && (
        <div className="modal-overlay" style={{position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div className="modal-content" style={{background: 'white', padding: '2rem', borderRadius: '12px', width: '100%', maxWidth: '500px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1rem'}}>
              <h3>Thêm danh mục mới</h3>
              <button onClick={() => setShowAddModal(false)} style={{background: 'none', border: 'none', cursor: 'pointer'}}><X /></button>
            </div>
            <form onSubmit={handleAddCategory} style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              <div>
                <label>Tên danh mục</label>
                <input className="form-control" value={newCat.tenDanhMuc} onChange={e=>setNewCat({...newCat, tenDanhMuc: e.target.value})} required />
              </div>
              <div>
                <label>Mô tả</label>
                <textarea className="form-control" value={newCat.mota} onChange={e=>setNewCat({...newCat, mota: e.target.value})} />
              </div>
              <div>
                <label>Ảnh đại diện (tùy chọn)</label>
                <input type="file" className="form-control" onChange={e=>setNewCatImage(e.target.files[0])} accept="image/*" />
              </div>
              <button type="submit" className="btn btn-primary" style={{marginTop: '1rem'}}>Tạo danh mục</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
