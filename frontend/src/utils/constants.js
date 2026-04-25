export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'
export const APP_NAME = 'ESale'
export const ITEMS_PER_PAGE = 10

export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
}
