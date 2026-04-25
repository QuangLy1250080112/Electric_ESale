import api from './api'

// Get user orders
export const getOrders = async () => {
  const response = await api.get('/v1/orders')
  return response.data
}

// Get order details
export const getOrder = async (id) => {
  const response = await api.get(`/v1/orders/${id}`)
  return response.data
}

// Create order
export const createOrder = async (orderData) => {
  const response = await api.post('/v1/orders', orderData)
  return response.data
}

// Update order status (admin)
export const updateOrderStatus = async (id, status) => {
  const response = await api.put(`/v1/orders/${id}`, { status })
  return response.data
}

// Cancel order
export const cancelOrder = async (id) => {
  const response = await api.delete(`/v1/orders/${id}`)
  return response.data
}
