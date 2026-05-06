import api from './api'

// Get all products
export const getProducts = async (params = {}) => {
  const response = await api.get('/v1/products', { params })
  return response.data
}

// Get single product
export const getProduct = async (id) => {
  const response = await api.get(`/v1/products/${id}`)
  return response.data
}

// Search products
export const searchProducts = async (query, categoryId = null) => {
  const response = await api.get('/v1/products', {
    params: { search: query, category_id: categoryId }
  })
  return response.data
}

// Get categories
export const getCategories = async () => {
  const response = await api.get('/v1/categories')
  return response.data
}

// Get category details
export const getCategory = async (id) => {
  const response = await api.get(`/v1/categories/${id}`)
  return response.data
}

// Add new product
export const addProduct = async (productData) => {
  const response = await api.post('/v1/products', productData)
  return response.data
}
