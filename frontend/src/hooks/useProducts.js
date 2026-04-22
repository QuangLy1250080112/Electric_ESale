import { useState, useEffect } from 'react'
import * as productService from '../services/productService'
import { useProductStore } from '../store/productStore'

export const useProducts = () => {
  const { products, categories, loading, setProducts, setCategories, setLoading } = useProductStore()
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [productsData, categoriesData] = await Promise.all([
          productService.getProducts(),
          productService.getCategories(),
        ])
        setProducts(productsData)
        setCategories(categoriesData)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (products.length === 0) {
      fetchData()
    }
  }, [])

  return { products, categories, loading, error }
}
