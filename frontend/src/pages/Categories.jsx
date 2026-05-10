import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import * as productService from '../services/productService'
import { getImageUrl } from '../utils/url'
import Loader from '../components/common/Loader'
import { Layers, Upload, Image, ArrowRight } from 'lucide-react'
import '../styles/Categories.css'

export default function Categories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [uploadingId, setUploadingId] = useState(null)
  const { user } = useAuth()
  const navigate = useNavigate()

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
      <div className="categories-header">
        <div className="categories-header-icon">
          <Layers size={32} />
        </div>
        <h1>Danh mục sản phẩm</h1>
        <p>Khám phá sản phẩm theo từng danh mục chuyên biệt</p>
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
    </div>
  )
}
