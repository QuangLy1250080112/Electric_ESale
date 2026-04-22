import { useCart } from '../../hooks/useCart'

export default function CartSummary() {
  const { items, total, itemCount } = useCart()

  return (
    <div className="cart-summary">
      <h2>Order Summary</h2>
      <div className="summary-item">
        <span>Items ({itemCount}):</span>
        <span>${total.toFixed(2)}</span>
      </div>
      <div className="summary-item">
        <span>Shipping:</span>
        <span>$0.00</span>
      </div>
      <div className="summary-item">
        <span>Tax:</span>
        <span>${(total * 0.1).toFixed(2)}</span>
      </div>
      <div className="summary-total">
        <span>Total:</span>
        <span>${(total * 1.1).toFixed(2)}</span>
      </div>
      <button className="btn-primary btn-checkout">Proceed to Checkout</button>
    </div>
  )
}
