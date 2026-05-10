import ProductCard from './ProductCard'
import Loader from '../common/Loader'

export default function ProductList({ products, loading, error, onRefresh }) {
  if (loading) return (
    <div className="flex justify-center items-center py-20">
      <Loader />
    </div>
  )
  
  if (error) return (
    <div className="text-center py-20">
      <div className="text-danger mb-4">Đã xảy ra lỗi: {error}</div>
      <button className="btn btn-secondary" onClick={() => window.location.reload()}>Thử lại</button>
    </div>
  )

  if (products.length === 0) return (
    <div className="text-center py-20 text-muted">
      Không tìm thấy sản phẩm nào.
    </div>
  )

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.ID_sanpham || product.id} product={product} onDelete={onRefresh} />
      ))}
    </div>
  )
}
