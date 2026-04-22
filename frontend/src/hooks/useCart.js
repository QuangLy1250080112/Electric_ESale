import { useCartStore } from '../store/cartStore'

export const useCart = () => {
  const { items, total, addItem, removeItem, updateQuantity, clearCart } = useCartStore()

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return {
    items,
    total,
    itemCount,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  }
}
