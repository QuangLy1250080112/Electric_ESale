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

// Create category
export const createCategory = async (data) => {
  const response = await api.post('/v1/categories', data)
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

// Update product
export const updateProduct = async (id, productData) => {
  const response = await api.put(`/v1/products/${id}`, productData)
  return response.data
}

// Add product image
export const addProductImage = async (productId, file) => {
  const formData = new FormData()
  formData.append('file', file)
  const response = await api.post(`/v1/products/${productId}/images`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return response.data
}

// Delete product image
export const deleteProductImage = async (imageId) => {
  const response = await api.delete(`/v1/products/images/${imageId}`)
  return response.data
}
export const deleteProduct = async (id) => {
  const response = await api.delete(`/v1/products/${id}`)
  return response.data
}

// ===== SUPPLIERS =====
export const getSuppliers = async (search = '') => {
  const params = search ? { search } : {}
  const response = await api.get('/v1/suppliers', { params })
  return response.data
}

export const createSupplier = async (data) => {
  const response = await api.post('/v1/suppliers', data)
  return response.data
}

export const updateSupplier = async (id, data) => {
  const response = await api.put(`/v1/suppliers/${id}`, data)
  return response.data
}

export const deleteSupplier = async (id) => {
  const response = await api.delete(`/v1/suppliers/${id}`)
  return response.data
}

// ===== ACCOUNTS =====
export const getAccounts = async () => {
  const response = await api.get('/v1/accounts')
  return response.data
}

export const createAccount = async (data) => {
  const response = await api.post('/v1/accounts', data)
  return response.data
}

export const updateAccount = async (id, data) => {
  const response = await api.put(`/v1/accounts/${id}`, data)
  return response.data
}

export const deleteAccount = async (id) => {
  const response = await api.delete(`/v1/accounts/${id}`)
  return response.data
}
