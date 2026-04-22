import { useCart } from '../hooks/useCart'
import CartItem from '../components/cart/CartItem'
import CartSummary from '../components/cart/CartSummary'
import { Link } from 'react-router-dom'

export default function Cart() {
  const { items } = useCart()

  if (items.length === 0) {
    return (
      <div className="cart-page empty">
        <h1>Shopping Cart</h1>
        <p>Your cart is empty</p>
        <Link to="/products" className="btn-primary">
          Continue Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="cart-page">
      <h1>Shopping Cart</h1>
      <div className="cart-container">
        <div className="cart-items">
          {items.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>
        <CartSummary />
      </div>
    </div>
  )
}
