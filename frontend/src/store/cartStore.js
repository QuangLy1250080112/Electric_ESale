import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useCartStore = create(
  persist(
    (set) => ({
      items: [],
      total: 0,

      addItem: (product, qty = 1) =>
        set((state) => {
          const addedQuantity = typeof qty === 'number' && qty > 0 ? qty : 1;
          const existingItem = state.items.find((item) => item.id === product.id)
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.id === product.id ? { ...item, quantity: item.quantity + addedQuantity } : item
              ),
              total: state.total + (product.price * addedQuantity),
            }
          }
          return {
            items: [...state.items, { ...product, quantity: addedQuantity }],
            total: state.total + (product.price * addedQuantity),
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
    }),
    {
      name: 'esale-cart',
    }
  )
)
