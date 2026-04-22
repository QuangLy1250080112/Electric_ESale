import { useCart } from '../../hooks/useCart'

export default function CartItem({ item }) {
  const { updateQuantity, removeItem } = useCart()

  return (
    <div className="cart-item">
      <img src={item.image_url || '/placeholder.png'} alt={item.name} />
      <div className="item-details">
        <h3>{item.name}</h3>
        <p className="price">${item.price}</p>
      </div>
      <div className="item-actions">
        <input
          type="number"
          min="1"
          value={item.quantity}
          onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
        />
        <button onClick={() => removeItem(item.id)} className="btn-danger">
          Remove
        </button>
      </div>
      <p className="item-total">${(item.price * item.quantity).toFixed(2)}</p>
    </div>
  )
}
