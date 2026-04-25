import { useState } from 'react'
import { useCart } from '../../hooks/useCart'

export default function ProductDetails({ product }) {
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCart()

  const handleAddToCart = () => {
    addItem({ ...product, quantity })
  }

  return (
    <div className="product-details">
      <img src={product.image_url || '/placeholder.png'} alt={product.name} />
      <div className="details">
        <h1>{product.name}</h1>
        <p className="price">${product.price}</p>
        <p className="stock">In Stock: {product.stock}</p>
        <p className="description">{product.description}</p>

        <div className="actions">
          <input
            type="number"
            min="1"
            max={product.stock}
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
          />
          <button onClick={handleAddToCart} className="btn-primary">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}
