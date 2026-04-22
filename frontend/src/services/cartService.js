import api from './api'

// Get cart
export const getCart = async () => {
  const response = await api.get('/v1/cart')
  return response.data
}

// Add to cart
export const addToCart = async (productId, quantity) => {
  const response = await api.post('/v1/cart/items', { product_id: productId, quantity })
  return response.data
}

// Update cart item
export const updateCartItem = async (itemId, quantity) => {
  const response = await api.put(`/v1/cart/items/${itemId}`, { quantity })
  return response.data
}

// Remove from cart
export const removeFromCart = async (itemId) => {
  const response = await api.delete(`/v1/cart/items/${itemId}`)
  return response.data
}

// Clear cart
export const clearCart = async () => {
  const response = await api.delete('/v1/cart')
  return response.data
}
