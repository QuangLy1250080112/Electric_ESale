import { create } from 'zustand'

export const useCartStore = create((set) => ({
  items: [],
  total: 0,

  addItem: (product) =>
    set((state) => {
      const existingItem = state.items.find((item) => item.id === product.id)
      if (existingItem) {
        return {
          items: state.items.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          ),
          total: state.total + product.price,
        }
      }
      return {
        items: [...state.items, { ...product, quantity: 1 }],
        total: state.total + product.price,
      }
    }),

  removeItem: (productId) =>
    set((state) => {
      const item = state.items.find((item) => item.id === productId)
      return {
        items: state.items.filter((item) => item.id !== productId),
        total: state.total - (item?.price || 0) * (item?.quantity || 1),
      }
    }),

  updateQuantity: (productId, quantity) =>
    set((state) => {
      const item = state.items.find((item) => item.id === productId)
      if (!item) return state
      const priceDifference = item.price * (quantity - item.quantity)
      return {
        items: state.items.map((item) =>
          item.id === productId ? { ...item, quantity } : item
        ),
        total: state.total + priceDifference,
      }
    }),

  clearCart: () => set({ items: [], total: 0 }),
}))
