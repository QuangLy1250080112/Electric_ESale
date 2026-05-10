import api from './api'

// Get all products
export const getProducts = async (params = {}) => {
  const response = await api.get('/v1/products', { params })
  return response.data
}

// Get newest products
export const getNewestProducts = async (limit = 10) => {
  const response = await api.get('/v1/products/newest', { params: { limit } })
  return response.data
}

// Get hottest/best-selling products
export const getHottestProducts = async (limit = 10) => {
  const response = await api.get('/v1/products/hottest', { params: { limit } })
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

// Get products by category
export const getCategoryProducts = async (id) => {
  const response = await api.get(`/v1/categories/${id}/products`)
  return response.data
}

// Upload category image
export const uploadCategoryImage = async (categoryId, file) => {
  const formData = new FormData()
  formData.append('file', file)
  const response = await api.post(`/v1/categories/${categoryId}/image`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return response.data
}

// Add new product
export const addProduct = async (productData) => {
  const response = await api.post('/v1/products', productData)
  return response.data
}

// Add product image
export const addProductImage = async (productId, file) => {
  const formData = new FormData()
  formData.append('file', file)
  const response = await api.post(`/v1/products/${productId}/images`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  return response.data
}

// Delete product
export const deleteProduct = async (id) => {
  const response = await api.delete(`/v1/products/${id}`)
  return response.data
}

// Get all suppliers
export const getSuppliers = async () => {
  const response = await api.get('/v1/products/suppliers/all')
  return response.data
}
