import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import * as productService from '../services/productService'
import ProductDetails from '../components/products/ProductDetails'
import Loader from '../components/common/Loader'

export default function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await productService.getProduct(id)
        setProduct(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  if (loading) return <Loader />
  if (error) return <div className="error">Error: {error}</div>
  if (!product) return <div className="error">Product not found</div>

  return (
    <div className="product-detail-page">
      <ProductDetails product={product} />
    </div>
  )
}
