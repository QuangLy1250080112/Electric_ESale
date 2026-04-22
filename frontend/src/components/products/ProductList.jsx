import ProductCard from './ProductCard'
import Loader from '../common/Loader'

export default function ProductList({ products, loading, error }) {
  if (loading) return <Loader />
  if (error) return <div className="error">Error: {error}</div>

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
