import { create } from 'zustand'
import * as cartService from '../services/cartService'

export const useCartStore = create((set, get) => ({
  items: [],
  total: 0,
  loading: false,

  fetchCart: async () => {
    const token = localStorage.getItem('access_token')
    if (!token) {
      set({ items: [], total: 0 });
      return;
    }
    
    set({ loading: true });
    try {
      const data = await cartService.getCart();
      const formattedItems = data.items.map(item => ({
        id: item.ID_sanpham,
        cartItemId: item.ID_giohang,
        name: item.tenSP,
        price: item.gia,
        quantity: item.soluong,
        image_url: item.HinhAnh_url
      }))
      set({ items: formattedItems, total: data.total, loading: false })
    } catch (error) {
      console.error("Lỗi lấy giỏ hàng", error)
      set({ items: [], total: 0, loading: false })
    }
  },

  addItem: async (product, qty = 1) => {
    const token = localStorage.getItem('access_token')
    if (!token) {
      alert("Vui lòng đăng nhập để thêm vào giỏ hàng")
      return
    }
    try {
      await cartService.addToCart(product.id, qty)
      await get().fetchCart()
    } catch (error) {
      console.error(error)
      alert("Lỗi thêm vào giỏ hàng")
    }
  },

  removeItem: async (productId) => {
    try {
      const item = get().items.find(i => i.id === productId)
      if (item && item.cartItemId) {
        await cartService.removeFromCart(item.cartItemId)
        await get().fetchCart()
      }
    } catch (error) {
      console.error(error)
    }
  },

  updateQuantity: async (productId, quantity) => {
    try {
      const item = get().items.find(i => i.id === productId)
      if (item && item.cartItemId) {
        await cartService.updateCartItem(item.cartItemId, quantity)
        await get().fetchCart()
      }
    } catch (error) {
      console.error(error)
    }
  },

  clearCart: async () => {
    const token = localStorage.getItem('access_token')
    if (token) {
      try {
        await cartService.clearCart()
      } catch (error) {
        console.error(error)
      }
    }
    set({ items: [], total: 0 })
  },
  
  clearCartLocal: () => {
    set({ items: [], total: 0 })
  }
}))
