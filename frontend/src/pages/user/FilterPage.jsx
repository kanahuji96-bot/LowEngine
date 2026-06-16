import { useState, useEffect } from 'react'
import { useSearchParams, Link, useNavigate } from 'react-router-dom'
import { Search, Tag, ChevronRight } from 'lucide-react'
import productService from '../../services/productService'
import categoryService from '../../services/categoryService'
import { PageLoader } from '../../components/ui/LoadingSpinner'
import { useCart } from '../../hooks/useCart'
import { Heart, Share2, ShoppingCart, ShoppingBasket, Star, Package } from 'lucide-react'
import { formatRupiah } from '../../utils/format'
import toast from 'react-hot-toast'

/* ── filter section buttons config ── */
const FILTER_SECTIONS = [
  { key: 'flash',    label: 'Flash Sale Products', section: 'trending' },
  { key: 'featured', label: 'Featured Products',   section: 'featured' },
  { key: 'trending', label: 'Trending Products',   section: 'trending' },
  { key: 'newest',   label: 'Newest Products',     section: 'newest'   },
  { key: 'free',     label: 'Free Products',       section: 'free'     },
  { key: 'all',      label: 'All Filters',          section: ''         },
]

const SORT_TABS = ['Best match','Featured','Trending','Rating','Released at','Price','Free','Promos','PWYW','Membership']

/* ── product card untuk halaman ini ── */
const FCard = ({ product }) => {
  const { addToCart } = useCart()
  const [wished,    setWished]    = useState(false)
  const [collected, setCollected] = useState(false)
  const [hov,       setHov]       = useState(false)

  const imgUrl  = product.image ? `/uploads/products/${product.image}` : null
  const reviewRating = product.Reviews?.length
    ? Math.round(product.Reviews.reduce((s, r) => s + r.rating, 0) / product.Reviews.length) : 0
  const storageKey = `vote_${product.id}`
  const [userVote,  setUserVote]  = useState(() => { try { return parseInt(localStorage.getItem(storageKey)) || 0 } catch { return 0 } })
  const [hoverStar, setHoverStar] = useState(0)
  const displayFilled = hoverStar || userVote || reviewRating

  const handleVote = (e, star) => {
    e.preventDefault(); e.stopPropagation()
    const next = userVote === star ? 0 : star
    setUserVote(next)
    try { next > 0 ? localStorage.setItem(storageKey, String(next)) : localStorage.removeItem(storageKey) } catch {}
    toast.success(next > 0 ? `Kamu memberi ${next} bintang!` : 'Rating dihapus')
  }
  const isFree  = !product.price || product.price < 1000
  const priceText = isFree ? 'Gratis'
    : `Rp ${Number(product.price).toLocaleString('id-ID')}`
  const sales = [13,21,13,17,11,18,16,15,12,8][product.id % 10]

  const getBadge = () => {
    if (isFree) return { label: 'Lite', color: '#22c55e' }
    if (product.price < 500000) return { label: 'Lite', color: '#22c55e' }
    if (product.price < 3000000) return { label: 'Star', color: '#D4AF37' }
    return { label: 'Dev', color: '#6366f1' }
  }
  const badge = getBadge()

  const onCart    = (e) => { e.preventDefault(); if (!product.stock) { toast.error('Habis'); return } addToCart(product,1); toast.success('Ditambahkan!') }
  const onCollect = (e) => {
    e.preventDefault()
    navigate('/membership')
  }
  const onWish    = (e) => { e.preventDefault(); setWished(!wished); toast.success(wished ? 'Dihapus wishlist' : 'Ke wishlist!') }
  const onShare   = (e) => { e.preventDefault(); navigator.clipboard?.writeText(window.location.origin+`/products/${product.slug}`); toast.success('Link disalin!') }

  return (
    <div
      className="rounded-xl overflow-hidden flex flex-col transition-all duration-200"
      style={{
        background: hov ? '#222' : '#1A1A1A',
        border: hov ? '1px solid rgba(212,175,55,0.4)' : '1px solid #2A2A2A',
        boxShadow: hov ? '0 0 20px rgba(212,175,55,0.1)' : '0 2px 8px rgba(0,0,0,0.4)',
        transform: hov ? 'translateY(-3px)' : 'none',
      }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>

      <div className="relative overflow-hidden" style={{ height: 168, background: '#111' }}>
        {imgUrl
          ? <img src={imgUrl} alt={product.name} className="w-full h-full object-cover transition-transform duration-500"
              style={{ transform: hov ? 'scale(1.05)' : 'scale(1)' }} />
          : <div className="w-full h-full flex flex-col items-center justify-center gap-2">
              <Package size={38} className="text-gray-700" />
            </div>
        }
        {/* bookmark */}
        <div className="absolute top-0 left-0 w-10 h-10 overflow-hidden pointer-events-none">
          <div className="absolute -top-1 -left-1 w-0 h-0"
            style={{ borderLeft: '38px solid #D4AF37', borderBottom: '38px solid transparent' }} />
          <Star size={10} className="absolute top-1 left-1 text-black fill-black z-10" />
        </div>
        <button onClick={onShare}
          className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.15)' }}>
          <Share2 size={11} className="text-gray-300" />
        </button>
        {!product.stock && (
          <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.65)' }}>
            <span className="text-xs font-bold text-gray-300 border border-gray-600 px-3 py-1 rounded-full">Habis</span>
          </div>
        )}
      </div>

      <div className="p-3 flex flex-col flex-1">
        <Link to={`/products/${product.slug}`}
          className="text-sm font-semibold leading-snug line-clamp-2 mb-2 transition-colors"
          style={{ color: hov ? '#D4AF37' : '#e5e7eb' }}>
          {product.name}
        </Link>
        <div className="flex items-center gap-0.5 mb-1">
          {[1,2,3,4,5].map(s => (
            <button
              key={s}
              onClick={(e) => handleVote(e, s)}
              onMouseEnter={() => setHoverStar(s)}
              onMouseLeave={() => setHoverStar(0)}
              className="transition-transform hover:scale-125 active:scale-110"
              style={{ cursor: 'pointer', background: 'none', border: 'none', padding: '1px' }}
            >
              <Star
                size={14}
                className={s <= displayFilled ? 'text-[#D4AF37] fill-[#D4AF37]' : 'text-gray-600'}
                style={{ transition: 'all 0.15s' }}
              />
            </button>
          ))}
          {userVote > 0 && <span className="text-[10px] text-gray-500 ml-1">({userVote})</span>}
        </div>
        <p className="text-xs text-gray-500 mb-3">{sales} Sales</p>
        <div className="flex items-center justify-between mt-auto pt-2.5" style={{ borderTop: '1px solid #2A2A2A' }}>
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-sm font-black text-white whitespace-nowrap">{priceText}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button onClick={onCart} disabled={!product.stock}
              className="w-7 h-7 rounded-lg flex items-center justify-center hover:scale-110 disabled:opacity-40 transition-all"
              style={{ background: '#166534' }}>
              <ShoppingCart size={13} className="text-green-400" />
            </button>
            <button onClick={onCollect}
              className="w-7 h-7 rounded-lg flex items-center justify-center hover:scale-110 transition-all"
              style={{ background: collected ? 'rgba(59,130,246,0.3)' : 'rgba(59,130,246,0.15)' }}>
              <ShoppingBasket size={13} className="text-blue-400" />
            </button>
            <button onClick={onWish}
              className="w-7 h-7 rounded-lg flex items-center justify-center hover:scale-110 transition-all"
              style={{ background: wished ? 'rgba(239,68,68,0.3)' : 'rgba(239,68,68,0.15)' }}>
              <Heart size={13} className={wished ? 'fill-red-400 text-red-400' : 'text-red-400'} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   MAIN
══════════════════════════════════════════════════════════ */
export default function FilterPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const initFilter = searchParams.get('filter') || 'flash'

  const [products,   setProducts]   = useState([])
  const [categories, setCategories] = useState([])
  const [loading,    setLoading]    = useState(true)
  const [activeFilter, setActiveFilter] = useState(initFilter)
  const [activeSort,   setActiveSort]   = useState('Best match')
  const [search,       setSearch]       = useState('')
  const [priceMin,     setPriceMin]     = useState('')
  const [priceMax,     setPriceMax]     = useState('')
  const [activeCategory, setActiveCategory] = useState('')

  const currentSection = FILTER_SECTIONS.find(f => f.key === activeFilter)
  const pageTitle = FILTER_SECTIONS.find(f => f.key === activeFilter)?.label || 'All Products'

  const fetchProducts = () => {
    setLoading(true)
    const params = { status: 'active' }
    if (currentSection?.section) params.section = currentSection.section
    if (activeCategory) params.category_id = activeCategory
    if (search.trim()) params.search = search.trim()
    productService.getAll(params)
      .then(r => {
        let data = r.data.data
        // filter harga client-side
        if (priceMin) data = data.filter(p => Number(p.price) >= Number(priceMin))
        if (priceMax) data = data.filter(p => Number(p.price) <= Number(priceMax))
        // sort
        if (activeSort === 'Price') data = [...data].sort((a,b) => Number(a.price) - Number(b.price))
        if (activeSort === 'Rating') data = [...data].sort((a,b) => {
          const ra = a.Reviews?.length ? a.Reviews.reduce((s,r) => s+r.rating,0)/a.Reviews.length : 0
          const rb = b.Reviews?.length ? b.Reviews.reduce((s,r) => s+r.rating,0)/b.Reviews.length : 0
          return rb - ra
        })
        if (activeSort === 'Released at') data = [...data].sort((a,b) => new Date(b.created_at) - new Date(a.created_at))
        if (activeSort === 'Free') data = data.filter(p => !p.price || p.price < 1000)
        setProducts(data)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    categoryService.getAll().then(r => setCategories(r.data.data)).catch(() => {})
  }, [])

  useEffect(() => { fetchProducts() }, [activeFilter, activeSort, activeCategory])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    fetchProducts()
  }

  const handleFilterSection = (key) => {
    setActiveFilter(key)
    setSearchParams({ filter: key })
  }

  const handlePriceFilter = () => fetchProducts()

  return (
    <div style={{ background: '#0A0A0A', minHeight: '100vh' }}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-6">

          {/* ── SIDEBAR ── */}
          <div className="w-64 shrink-0 space-y-4">

            {/* Product Category */}
            <div className="rounded-xl overflow-hidden" style={{ background: '#1A1A1A', border: '1px solid #2A2A2A' }}>
              <div className="px-4 py-3 font-bold text-white text-sm"
                style={{ background: 'linear-gradient(135deg,#8B6914,#D4AF37)', borderBottom: '1px solid #2A2A2A' }}>
                Product Category
              </div>
              <div className="p-3 space-y-1">
                <button
                  onClick={() => setActiveCategory('')}
                  className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm transition-all text-left"
                  style={{ color: !activeCategory ? '#D4AF37' : '#9ca3af', background: !activeCategory ? 'rgba(212,175,55,0.08)' : 'transparent' }}>
                  <Tag size={13} className={!activeCategory ? 'text-[#D4AF37]' : 'text-gray-600'} />
                  Semua Kategori
                </button>
                {categories.map(cat => (
                  <button key={cat.id}
                    onClick={() => setActiveCategory(String(cat.id))}
                    className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm transition-all text-left"
                    style={{
                      color: activeCategory === String(cat.id) ? '#D4AF37' : '#9ca3af',
                      background: activeCategory === String(cat.id) ? 'rgba(212,175,55,0.08)' : 'transparent',
                    }}>
                    <ChevronRight size={12} className={activeCategory === String(cat.id) ? 'text-[#D4AF37]' : 'text-gray-600'} />
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="rounded-xl overflow-hidden" style={{ background: '#1A1A1A', border: '1px solid #2A2A2A' }}>
              <div className="px-4 py-3 font-bold text-white text-sm"
                style={{ background: 'linear-gradient(135deg,#8B6914,#D4AF37)', borderBottom: '1px solid #2A2A2A' }}>
                Price Range
              </div>
              <div className="p-4 space-y-3">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block font-semibold">Min</label>
                  <input type="number" value={priceMin} onChange={e => setPriceMin(e.target.value)}
                    placeholder="0" className="input-field text-sm" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block font-semibold">Max</label>
                  <input type="number" value={priceMax} onChange={e => setPriceMax(e.target.value)}
                    placeholder="999999999" className="input-field text-sm" />
                </div>
                <button onClick={handlePriceFilter}
                  className="w-full flex items-center justify-center gap-1 py-2 rounded-lg text-sm font-semibold transition-all"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid #333', color: '#D4AF37' }}>
                  Filter <ChevronRight size={14} />
                </button>
              </div>
            </div>

          </div>

          {/* ── MAIN CONTENT ── */}
          <div className="flex-1 min-w-0">

            {/* Title */}
            <div className="mb-4">
              <h1 className="text-2xl font-black text-white flex items-center gap-3">
                List of {pageTitle}
                <span className="text-sm font-normal text-gray-500">{products.length} items.</span>
              </h1>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Discover the best {pageTitle.toLowerCase()} digital products. Premium scripts, professional source code, and ready-to-use digital solutions with updates and support.{' '}
                <button className="text-[#D4AF37] hover:underline text-xs">read more</button>
              </p>
            </div>

            {/* Sort tabs */}
            <div className="flex gap-1.5 flex-wrap mb-4">
              {SORT_TABS.map(tab => (
                <button key={tab} onClick={() => setActiveSort(tab)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                  style={activeSort === tab
                    ? { background: '#D4AF37', color: '#000' }
                    : { background: '#1A1A1A', color: '#9ca3af', border: '1px solid #2A2A2A' }}>
                  {tab}
                </button>
              ))}
            </div>

            {/* Reset + desc */}
            <div className="mb-4 p-3 rounded-xl" style={{ background: '#111', border: '1px solid #1A1A1A' }}>
              <p className="text-sm font-bold text-white mb-1">Reset to Other Filter</p>
              <p className="text-xs text-gray-500 leading-relaxed">
                Filter Items by Relevance and Recommendations, Excellence and Quality, Trends and Popularity, Rating and Review, Date and Release, Price Update, Promo Update, Pay What You Want, Membership Product, and Free Product. This is an alternative way to find relevant items.
              </p>
            </div>

            {/* Search + filter section buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 flex-1">
                <div className="flex items-center flex-1 rounded-lg overflow-hidden"
                  style={{ background: '#1A1A1A', border: '1px solid #2A2A2A' }}>
                  <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Searching..."
                    className="flex-1 px-3 py-2 bg-transparent text-sm text-white placeholder-gray-600 outline-none" />
                  <button type="submit" className="px-3 py-2 text-gray-400 hover:text-white transition-colors">
                    <Search size={15} />
                  </button>
                </div>
              </form>
            </div>

            {/* Filter section pills */}
            <div className="flex gap-2 flex-wrap mb-6">
              {FILTER_SECTIONS.map(f => (
                <button key={f.key} onClick={() => handleFilterSection(f.key)}
                  className="px-4 py-2 rounded-full text-xs font-bold transition-all"
                  style={activeFilter === f.key
                    ? { background: '#8B6914', color: '#fff', border: '1px solid #D4AF37' }
                    : { background: '#1A1A1A', color: '#9ca3af', border: '1px solid #2A2A2A' }}>
                  {f.label}
                </button>
              ))}
            </div>

            {/* Products grid */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-2 border-dark-500 border-t-primary rounded-full animate-spin" />
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <Package size={48} className="text-gray-700 mx-auto mb-4" />
                <p className="text-gray-500">Tidak ada produk ditemukan</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map(p => <FCard key={p.id} product={p} />)}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}
