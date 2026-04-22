export default function ProductCard({ product }) {
  return (
    <div className="product-card">
      <img src={product.image_url || '/placeholder.png'} alt={product.name} />
      <h3>{product.name}</h3>
      <p className="price">${product.price}</p>
      <p className="stock">Stock: {product.stock}</p>
      <p className="description">{product.description.substring(0, 50)}...</p>
      <button className="btn-primary">View Details</button>
    </div>
  )
}
