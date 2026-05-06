import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useProducts } from '../hooks/useProducts'
import { useAuthStore } from '../store/authStore'
import * as productService from '../services/productService'
import ProductList from '../components/products/ProductList'

export default function Products() {
  const { products: allProducts, loading, error, refreshProducts } = useProducts()
  const { user } = useAuthStore()
  const [searchParams, setSearchParams] = useSearchParams()
  
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [showAddForm, setShowAddForm] = useState(false)
  const [newProduct, setNewProduct] = useState({
    tenSP: '',
    mota: '',
    gia: '',
    ID_danhmuc: 1,
    supplier_ID: 1
  })

  useEffect(() => {
    const query = searchParams.get('search')
    if (query) setSearch(query)
  }, [searchParams])

  const filtered = allProducts.filter((p) => {
    const matchesSearch = p.tenSP.toLowerCase().includes(search.toLowerCase())
    return matchesSearch
  })

  const handleAddProduct = async (e) => {
    e.preventDefault()
    try {
      await productService.addProduct({
        ...newProduct,
        gia: parseFloat(newProduct.gia)
      })
      alert('Thêm sản phẩm thành công!')
      setShowAddForm(false)
      if (refreshProducts) refreshProducts()
      else window.location.reload()
    } catch (err) {
      alert('Lỗi: ' + (err.response?.data?.detail || 'Không thể thêm sản phẩm'))
    }
  }

  return (
    <div className="products-page">
      <div className="products-header">
        <div className="header-text">
          <h1>Danh sách Sản phẩm</h1>
          <p>Tìm thấy {filtered.length} sản phẩm phù hợp</p>
        </div>
        
        {user?.is_admin && (
          <button 
            className="btn-primary" 
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? 'Hủy bỏ' : '+ Thêm sản phẩm'}
          </button>
        )}
      </div>

      <div className="products-toolbar">
        <div className="search-box">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên sản phẩm..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setSearchParams({ search: e.target.value })
            }}
          />
        </div>
      </div>

      {showAddForm && (
        <div className="add-product-form-container">
          <form onSubmit={handleAddProduct} className="add-product-form">
            <h3>Thêm sản phẩm mới</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Tên sản phẩm</label>
                <input 
                  type="text" 
                  value={newProduct.tenSP} 
                  onChange={(e) => setNewProduct({...newProduct, tenSP: e.target.value})}
                  required 
                />
              </div>
              <div className="form-group">
                <label>Giá (VNĐ)</label>
                <input 
                  type="number" 
                  value={newProduct.gia} 
                  onChange={(e) => setNewProduct({...newProduct, gia: e.target.value})}
                  required 
                />
              </div>
              <div className="form-group">
                <label>Mô tả</label>
                <textarea 
                  value={newProduct.mota} 
                  onChange={(e) => setNewProduct({...newProduct, mota: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>ID Danh mục</label>
                <input 
                  type="number" 
                  value={newProduct.ID_danhmuc} 
                  onChange={(e) => setNewProduct({...newProduct, ID_danhmuc: parseInt(e.target.value)})}
                />
              </div>
            </div>
            <button type="submit" className="btn-primary">Lưu sản phẩm</button>
          </form>
        </div>
      )}

      <div className="products-content">
        <ProductList products={filtered} loading={loading} error={error} />
      </div>
    </div>
  )
}
