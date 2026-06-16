import { useState, useEffect } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'
import productService from '../../services/productService'
import categoryService from '../../services/categoryService'
import ProductCard from '../../components/ui/ProductCard'
import { PageLoader } from '../../components/ui/LoadingSpinner'
import EmptyState from '../../components/ui/EmptyState'

const ProductsPage = () => {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

  useEffect(() => {
    categoryService.getAll().then((r) => setCategories(r.data.data)).catch(() => {})
  }, [])

  useEffect(() => {
    setLoading(true)
    const params = { status: 'active' }
    if (selectedCategory) params.category_id = selectedCategory
    if (search) params.search = search
    productService.getAll(params)
      .then((r) => setProducts(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [search, selectedCategory])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <p className="text-primary text-sm font-semibold mb-1">Katalog</p>
        <h1 className="text-3xl font-bold text-white">Semua Produk</h1>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Cari produk..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={16} className="text-gray-500" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="input-field w-auto"
          >
            <option value="">Semua Kategori</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Products */}
      {loading ? (
        <PageLoader />
      ) : products.length === 0 ? (
        <EmptyState
          title="Produk tidak ditemukan"
          description="Coba ubah kata kunci atau filter kategori"
        />
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-6">{products.length} produk ditemukan</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default ProductsPage
