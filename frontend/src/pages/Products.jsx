import { useState } from 'react'
import { useProducts } from '../hooks/useProducts'
import ProductList from '../components/products/ProductList'

export default function Products() {
  const { products, loading, error } = useProducts()
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState(null)

  const filtered = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = !categoryFilter || p.category_id === categoryFilter
    return matchesSearch && matchesCategory
  })

  return (
    <div className="products-page">
      <h1>Products</h1>

      <div className="filters">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {/* Category filter */}
      </div>

      <ProductList products={filtered} loading={loading} error={error} />
    </div>
  )
}
