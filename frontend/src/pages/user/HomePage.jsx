import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Search, SlidersHorizontal, Percent, BookOpen,
  ShoppingCart, User, Star, Heart,
  ArrowRight, Tag, Download, Package,
  Share2, ShoppingBasket, CheckCircle2, Rss,
  Gift, Info, Youtube, Facebook, Twitter, Send, Instagram,
  ArrowUp
} from 'lucide-react'
import productService from '../../services/productService'
import categoryService from '../../services/categoryService'
import { PageLoader } from '../../components/ui/LoadingSpinner'
import GlobalFooter from '../../components/ui/GlobalFooter'
import { useCart } from '../../hooks/useCart'
import { useAuth } from '../../hooks/useAuth'
import { useLang } from '../../hooks/useLang'
import { LANG_LIST } from '../../utils/i18n'
import toast from 'react-hot-toast'

/* ── Dropdown ── */
const Dropdown = ({ items, onClose }) => (
  <div className="absolute top-full mt-1 rounded-xl overflow-hidden py-2 z-[999] min-w-[200px]"
    style={{ background: '#fff', boxShadow: '0 8px 32px rgba(0,0,0,0.18)', border: '1px solid #e8e8e8' }}>
    {items.map(({ label, to }) => (
      <Link key={label} to={to} onClick={onClose}
        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 transition-colors"
        onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
        <span className="text-gray-400 text-xs">▶</span>
        {label}
      </Link>
    ))}
  </div>
)

/* ── TopNav ── */
const TopNav = () => {
  const navigate = useNavigate()
  const { totalItems, cart } = useCart()
  const { user, logout } = useAuth()
  const { lang, setLang, tr } = useLang()

  const [openMenu, setOpenMenu] = useState(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const [q, setQ] = useState('')

  useEffect(() => {
    const fn = (e) => { if (!e.target.closest('[data-nav]')) setOpenMenu(null) }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [])

  const toggle = (key) => setOpenMenu(prev => prev === key ? null : key)
  const close = () => setOpenMenu(null)

  const handleSearch = (e) => {
    e.preventDefault()
    if (q.trim()) { navigate(`/products?search=${encodeURIComponent(q.trim())}`); setSearchOpen(false); setQ('') }
  }

  const flagOf = (code) => LANG_LIST.find(l => l.code === code)?.flag || '🌐'

  const FILTER_ITEMS = [
    { label: tr('filter_flash'),    to: '/filter?filter=flash'    },
    { label: tr('filter_featured'), to: '/filter?filter=featured' },
    { label: tr('filter_trending'), to: '/filter?filter=trending' },
    { label: tr('filter_newest'),   to: '/filter?filter=newest'   },
    { label: tr('filter_free'),     to: '/filter?filter=free'     },
    { label: tr('filter_all'),      to: '/filter?filter=all'      },
  ]
  const PRODUCT_ITEMS = [
    { label: tr('prod_slot'),   to: '/category?name=Slot Game Script'     },
    { label: tr('prod_sport'),  to: '/category?name=Sportsbook Script'    },
    { label: tr('prod_casino'), to: '/category?name=Casino Game Script'   },
  ]
  const OFFERS_ITEMS = [
    { label: tr('offer_membership'), to: '/membership' },
    { label: tr('offer_affiliate'),  to: '/products'   },
    { label: tr('offer_services'),   to: '/services'   },
    { label: tr('offer_promo'),      to: '/products'   },
  ]
  const CONTENT_ITEMS = [
    { label: tr('content_latest'), to: '/products' },
    { label: tr('content_category'), to: '/products' },
    { label: tr('content_search'), to: '/products' },
    { label: tr('content_articles'), to: '/products' },
    { label: tr('content_article_cat'), to: '/products' },
    { label: tr('content_search_art'), to: '/products' },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 h-14"
      style={{ background: 'rgba(8,8,8,0.98)', borderBottom: '2px solid #D4AF37' }}>
      <Link to="/" className="flex items-center shrink-0">
        <span className="text-xl font-black italic tracking-wide"
          style={{ background: 'linear-gradient(90deg,#D4AF37,#F0D060,#B8960C)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          LowEngine
        </span>
      </Link>

      <div className="flex items-center gap-0.5" data-nav>
        {/* Search */}
        <div className="relative" data-nav>
          <button onClick={() => setSearchOpen(!searchOpen)}
            className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
            <Search size={16} />
          </button>
          {searchOpen && (
            <div className="absolute right-0 top-full mt-2 rounded-xl z-[999]"
              style={{ background: '#fff', boxShadow: '0 8px 32px rgba(0,0,0,0.2)', border: '1px solid #e8e8e8', width: 280 }}>
              <form onSubmit={handleSearch} className="flex items-center px-3 py-2 gap-2">
                <Search size={14} className="text-gray-400 shrink-0" />
                <input autoFocus type="text" value={q} onChange={e => setQ(e.target.value)}
                  placeholder={tr('nav_search_placeholder')}
                  className="flex-1 text-sm text-gray-700 outline-none bg-transparent py-1" />
                <button type="submit" className="text-xs font-bold text-white px-3 py-1.5 rounded-lg"
                  style={{ background: '#e53e3e' }}>Go</button>
              </form>
            </div>
          )}
        </div>

        {/* Filter */}
        <div className="relative" data-nav>
          <button onClick={() => toggle('filter')}
            className="flex items-center gap-1.5 px-3 h-9 text-sm transition-colors"
            style={{ color: openMenu === 'filter' ? '#fff' : '#d1d5db' }}>
            <SlidersHorizontal size={14} /> {tr('nav_filter')}
          </button>
          {openMenu === 'filter' && <Dropdown items={FILTER_ITEMS} onClose={close} />}
        </div>

        {/* Products */}
        <div className="relative" data-nav>
          <button onClick={() => toggle('products')}
            className="flex items-center gap-1.5 px-3 h-9 text-sm transition-colors"
            style={{ color: openMenu === 'products' ? '#fff' : '#d1d5db' }}>
            <Tag size={14} /> {tr('nav_products')}
          </button>
          {openMenu === 'products' && <Dropdown items={PRODUCT_ITEMS} onClose={close} />}
        </div>

        {/* Offers */}
        <div className="relative" data-nav>
          <button onClick={() => toggle('offers')}
            className="flex items-center gap-1.5 px-3 h-9 text-sm transition-colors"
            style={{ color: openMenu === 'offers' ? '#fff' : '#d1d5db' }}>
            <Percent size={14} /> {tr('nav_offers')}
          </button>
          {openMenu === 'offers' && <Dropdown items={OFFERS_ITEMS} onClose={close} />}
        </div>

        {/* Content */}
        <div className="relative" data-nav>
          <button onClick={() => toggle('content')}
            className="flex items-center gap-1.5 px-3 h-9 text-sm transition-colors"
            style={{ color: openMenu === 'content' ? '#fff' : '#d1d5db' }}>
            <Star size={14} /> {tr('nav_content')}
          </button>
          {openMenu === 'content' && <Dropdown items={CONTENT_ITEMS} onClose={close} />}
        </div>

        {/* Cart */}
        <div className="relative" data-nav>
          <button onClick={() => toggle('cart')}
            className="flex items-center gap-1.5 px-3 h-9 text-sm transition-colors"
            style={{ color: openMenu === 'cart' ? '#fff' : '#d1d5db' }}>
            <ShoppingCart size={14} /> ({totalItems})
          </button>
          {openMenu === 'cart' && (
            <div className="absolute right-0 top-full mt-1 rounded-xl overflow-hidden z-[999]"
              style={{ background: '#fff', boxShadow: '0 8px 32px rgba(0,0,0,0.18)', border: '1px solid #e8e8e8', minWidth: 220 }}>
              {cart.length === 0 ? (
                <div className="px-4 py-5 text-center">
                  <p className="text-sm text-gray-500 mb-3">{tr('nav_cart_empty')}</p>
                  <Link to="/products" onClick={close}
                    className="block text-center py-2 rounded-lg text-sm font-bold text-white"
                    style={{ background: '#06b6d4' }}>
                    {tr('nav_favorite')}
                  </Link>
                </div>
              ) : (
                <div className="p-3">
                  {cart.slice(0, 3).map(item => (
                    <div key={item.id} className="flex items-center gap-2 py-2 border-b border-gray-100 last:border-0">
                      <div className="w-8 h-8 rounded bg-gray-100 shrink-0 overflow-hidden">
                        {item.image && <img src={`/uploads/products/${item.image}`} className="w-full h-full object-cover" alt={item.name} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-700 truncate">{item.name}</p>
                        <p className="text-xs text-gray-400">×{item.quantity}</p>
                      </div>
                    </div>
                  ))}
                  <Link to="/cart" onClick={close}
                    className="block text-center py-2 mt-2 rounded-lg text-sm font-bold text-white"
                    style={{ background: '#06b6d4' }}>
                    {tr('nav_view_cart')} ({totalItems})
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Account */}
        <div className="relative" data-nav>
          <button onClick={() => toggle('account')}
            className="flex items-center gap-1.5 px-3 h-9 text-sm transition-colors"
            style={{ color: openMenu === 'account' ? '#fff' : '#d1d5db' }}>
            <User size={14} /> {tr('nav_account')}
          </button>
          {openMenu === 'account' && (
            <div className="absolute right-0 top-full mt-1 rounded-xl overflow-hidden py-2 z-[999]"
              style={{ background: '#fff', boxShadow: '0 8px 32px rgba(0,0,0,0.18)', border: '1px solid #e8e8e8', minWidth: 160 }}>
              {user ? (
                <>
                  <Link to="/profile" onClick={close}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    <User size={13} className="text-gray-400" /> {user.name}
                  </Link>
                  <Link to="/orders" onClick={close}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    <ShoppingCart size={13} className="text-gray-400" /> {tr('nav_my_orders')}
                  </Link>
                  {user.role === 'admin' && (
                    <Link to="/admin" onClick={close}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      <Star size={13} className="text-gray-400" /> {tr('nav_admin_panel')}
                    </Link>
                  )}
                  <hr className="border-gray-100 my-1" />
                  <button onClick={() => { logout(); close() }}
                    className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-gray-50 transition-colors">
                    <ArrowRight size={13} /> {tr('nav_logout')}
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={close}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    <User size={13} className="text-gray-400" /> {tr('nav_member')}
                  </Link>
                  <Link to="/register" onClick={close}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    <User size={13} className="text-gray-400" /> {tr('nav_guest')}
                  </Link>
                </>
              )}
            </div>
          )}
        </div>

        {/* Language */}
        <div className="relative" data-nav>
          <button onClick={() => toggle('lang')}
            className="flex items-center gap-1.5 px-3 h-9 text-sm transition-colors"
            style={{ color: openMenu === 'lang' ? '#fff' : '#d1d5db' }}>
            <span className="text-base leading-none">{flagOf(lang)}</span>
            {lang}
          </button>
          {openMenu === 'lang' && (
            <div className="absolute right-0 top-full mt-1 rounded-xl overflow-hidden py-2 z-[999]"
              style={{ background: '#fff', boxShadow: '0 8px 32px rgba(0,0,0,0.18)', border: '1px solid #e8e8e8',
                minWidth: 160, maxHeight: 320, overflowY: 'auto' }}>
              {LANG_LIST.map(l => (
                <button key={l.code}
                  onClick={() => { setLang(l.code); close() }}
                  className="flex items-center gap-3 w-full px-4 py-2 text-sm transition-colors text-left"
                  style={{ color: lang === l.code ? '#e53e3e' : '#374151', fontWeight: lang === l.code ? 700 : 400, background: 'transparent' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <span className="text-base leading-none w-5 text-center shrink-0">{l.flag}</span>
                  <span>{l.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

/* ── Hero ── */
const Hero = () => {
  const navigate = useNavigate()
  const { tr } = useLang()
  const [q, setQ] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    navigate(`/products${q.trim() ? `?search=${encodeURIComponent(q.trim())}` : ''}`)
  }

  return (
    <section className="relative flex items-center justify-center overflow-hidden" style={{ minHeight: 420, background: '#0a0a0a', paddingTop: 56 }}>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, #0a0a0a 0%, #111 40%, #0a0a0a 100%)' }} />
        <div className="absolute top-0 right-0 w-1/2 h-full"
          style={{ background: 'linear-gradient(200deg, #1a0a0a 0%, #0a0a0a 60%)', clipPath: 'polygon(20% 0%, 100% 0%, 100% 100%, 0% 100%)' }} />
        <div className="absolute top-0 left-0 w-full h-full" style={{ opacity: 0.7 }}>
          <div className="absolute" style={{ top: '10%', left: '15%', width: '35%', height: '2px', background: 'linear-gradient(90deg, transparent, #D4AF37, transparent)', transform: 'rotate(35deg) scaleX(3)', boxShadow: '0 0 20px 4px rgba(212,175,55,0.4)', filter: 'blur(0.5px)' }} />
          <div className="absolute" style={{ top: '35%', left: '5%', width: '25%', height: '1.5px', background: 'linear-gradient(90deg, transparent, #D4AF37, transparent)', transform: 'rotate(30deg) scaleX(2)', boxShadow: '0 0 15px 3px rgba(212,175,55,0.3)', filter: 'blur(0.5px)' }} />
          <div className="absolute" style={{ top: '20%', right: '5%', width: '30%', height: '2px', background: 'linear-gradient(90deg, transparent, #D4AF37, transparent)', transform: 'rotate(-20deg) scaleX(2)', boxShadow: '0 0 18px 3px rgba(212,175,55,0.35)', filter: 'blur(0.5px)' }} />
          <div className="absolute" style={{ top: '60%', right: '8%', width: '20%', height: '1.5px', background: 'linear-gradient(90deg, transparent, #D4AF37, transparent)', transform: 'rotate(15deg) scaleX(2)', boxShadow: '0 0 12px 2px rgba(212,175,55,0.25)', filter: 'blur(0.5px)' }} />
        </div>
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)' }} />
      </div>

      <div className="relative z-10 text-center px-4 py-16 max-w-3xl mx-auto">
        <h1 className="text-xl sm:text-2xl font-bold text-white mb-3 leading-tight">
          {tr('hero_title1')} {tr('hero_title2')}
        </h1>
        <p className="text-sm text-gray-400 mb-2">{tr('hero_powered')}</p>
        <div className="overflow-hidden h-6 mb-8">
          <p className="text-sm text-gray-500 whitespace-nowrap animate-marquee">
            source code, website script, online store script, website service, app template, digital product &nbsp;&nbsp;&nbsp; source code, website script, online store script, website service, app template, digital product
          </p>
        </div>
        <form onSubmit={handleSearch} className="flex items-center mx-auto rounded-full overflow-hidden"
          style={{ maxWidth: 480, background: '#fff', boxShadow: '0 4px 24px rgba(0,0,0,0.3)' }}>
          <input type="text" value={q} onChange={e => setQ(e.target.value)}
            placeholder={tr('hero_search')}
            className="flex-1 px-5 py-3 text-sm text-gray-700 outline-none bg-transparent" />
          <button type="submit" className="px-5 py-3">
            <Search size={16} className="text-gray-500" />
          </button>
        </form>
      </div>

      <div className="absolute bottom-0 left-0 right-0" style={{ lineHeight: 0 }}>
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
          <path d="M0,40 C200,80 400,0 600,40 C800,80 1000,0 1200,40 C1300,60 1380,50 1440,40 L1440,60 L0,60 Z" fill="#0A0A0A"/>
        </svg>
      </div>
    </section>
  )
}

/* ── Product Card ── */
const BADGE_COLOR = { Dev: '#6366f1', Star: '#D4AF37', Lite: '#22c55e', Free: '#0ea5e9' }

const PCard = ({ product, badge = 'Dev', salesCount, downloaded = false }) => {
  const { addToCart } = useCart()
  const { tr } = useLang()
  const navigate = useNavigate()
  const [wished, setWished] = useState(false)
  const [collected, setCollected] = useState(false)
  const [hov, setHov] = useState(false)

  const imgUrl = product.image ? `/uploads/products/${product.image}` : null
  const reviewRating = product.Reviews?.length ? Math.round(product.Reviews.reduce((s, r) => s + r.rating, 0) / product.Reviews.length) : 0
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

  const isFree = !product.price || product.price < 1000
  const priceText = isFree ? 'Gratis'
    : `Rp ${Number(product.price).toLocaleString('id-ID')}`

  const onCart = e => { e.preventDefault(); if (!product.stock) { toast.error(tr('card_sold_out')); return } addToCart(product, 1); toast.success('Ditambahkan!') }
  const onCollect = (e) => {
    e.preventDefault()
    navigate('/membership')
  }
  const onWish = e => { e.preventDefault(); setWished(!wished); toast.success(wished ? 'Dihapus wishlist' : 'Ke wishlist!') }
  const onShare = e => { e.preventDefault(); navigator.clipboard?.writeText(window.location.origin + `/products/${product.slug}`); toast.success('Link disalin!') }

  return (
    <div className="rounded-xl overflow-hidden flex flex-col transition-all duration-200"
      style={{
        background: hov ? '#222' : '#1A1A1A',
        border: hov ? '1px solid rgba(212,175,55,0.4)' : '1px solid #2A2A2A',
        boxShadow: hov ? '0 0 20px rgba(212,175,55,0.12), 0 8px 24px rgba(0,0,0,0.5)' : '0 2px 8px rgba(0,0,0,0.4)',
        transform: hov ? 'translateY(-3px)' : 'none',
      }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>

      <div className="relative overflow-hidden" style={{ height: 168, background: '#111' }}>
        {imgUrl
          ? <img src={imgUrl} alt={product.name} className="w-full h-full object-cover transition-transform duration-500" style={{ transform: hov ? 'scale(1.05)' : 'scale(1)' }} />
          : <div className="w-full h-full flex flex-col items-center justify-center gap-2" style={{ background: '#111' }}>
              <Package size={38} className="text-gray-700" />
            </div>
        }
        <div className="absolute top-0 left-0 w-10 h-10 overflow-hidden pointer-events-none">
          <div className="absolute -top-1 -left-1 w-0 h-0" style={{ borderLeft: '38px solid #D4AF37', borderBottom: '38px solid transparent' }} />
          <Star size={10} className="absolute top-1 left-1 text-black fill-black z-10" />
        </div>
        <button onClick={onShare} className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-all hover:scale-110"
          style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.15)' }}>
          <Share2 size={11} className="text-gray-300" />
        </button>
        {!product.stock && (
          <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.65)' }}>
            <span className="text-xs font-bold text-gray-300 border border-gray-600 px-3 py-1 rounded-full">{tr('card_sold_out')}</span>
          </div>
        )}
      </div>

      <div className="p-3 flex flex-col flex-1">
        {/* Title */}
        <a href={`/products/${product.slug}`}
          className="text-sm font-semibold leading-snug line-clamp-2 mb-2 transition-colors"
          style={{ color: hov ? '#D4AF37' : '#e5e7eb' }}>
          {product.name}
        </a>
        <div className="flex items-center gap-0.5 mb-1">
          {[1, 2, 3, 4, 5].map(s => (
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
                className={s <= displayFilled
                  ? 'text-[#D4AF37] fill-[#D4AF37]'
                  : 'text-gray-600'}
                style={{ transition: 'all 0.15s' }}
              />
            </button>
          ))}
          {userVote > 0 && (
            <span className="text-[10px] text-gray-500 ml-1">({userVote})</span>
          )}
        </div>
        <p className="text-xs text-gray-500 mb-3">
          {salesCount} {tr('card_sales')}
        </p>
        <div className="flex items-center justify-between mt-auto pt-2.5" style={{ borderTop: '1px solid #2A2A2A' }}>
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-sm font-black text-white whitespace-nowrap">
              {priceText}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <button onClick={onCart} disabled={!product.stock}
              className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:scale-110 disabled:opacity-40"
              style={{ background: '#166534' }} title={tr('card_add')}>
              <ShoppingCart size={13} className="text-green-400" />
            </button>
            <button onClick={onCollect}
              className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:scale-110"
              style={{ background: collected ? 'rgba(59,130,246,0.3)' : 'rgba(59,130,246,0.15)' }}>
              <ShoppingBasket size={13} className="text-blue-400" />
            </button>
            <button onClick={onWish}
              className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:scale-110"
              style={{ background: wished ? 'rgba(239,68,68,0.3)' : 'rgba(239,68,68,0.15)' }}>
              <Heart size={13} className={wished ? 'fill-red-400 text-red-400' : 'text-red-400'} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Free Card ── */
const FreeCard = ({ name, product }) => {
  const imgUrl = product?.image ? `/uploads/products/${product.image}` : null
  return (
    <Link to={product ? `/products/${product.slug}` : '/products'} className="group block">
      <div className="rounded-xl overflow-hidden mb-2 transition-all duration-200 group-hover:scale-105"
        style={{ height: 120, background: '#111', border: '1px solid #2A2A2A' }}>
        {imgUrl ? <img src={imgUrl} alt={name} className="w-full h-full object-cover" />
          : <div className="w-full h-full flex items-center justify-center"><Package size={28} className="text-gray-700" /></div>
        }
      </div>
      <p className="text-xs font-semibold text-center line-clamp-1" style={{ color: '#D4AF37' }}>{name}</p>
    </Link>
  )
}

/* ── Newest Card ── */
const NewestCard = ({ product }) => {
  const imgUrl = product?.image ? `/uploads/products/${product.image}` : null
  return (
    <Link to={product ? `/products/${product.slug}` : '/products'} className="group block">
      <div className="rounded-xl overflow-hidden transition-all duration-200 group-hover:scale-105"
        style={{ height: 110, background: '#111', border: '1px solid #2A2A2A' }}
        onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(212,175,55,0.3)'}
        onMouseLeave={e => e.currentTarget.style.borderColor = '#2A2A2A'}>
        {imgUrl ? <img src={imgUrl} alt={product?.name} className="w-full h-full object-cover" />
          : <div className="w-full h-full flex items-center justify-center"><Package size={28} className="text-gray-700" /></div>
        }
      </div>
    </Link>
  )
}

/* ── Section Head ── */
const SHead = ({ icon: Icon, title, desc }) => (
  <div className="text-center mb-8">
    <div className="flex items-center justify-center gap-2 mb-2">
      <Icon size={18} className="text-[#D4AF37] fill-[#D4AF37]" />
      <h2 className="text-2xl font-black text-white">{title}</h2>
    </div>
    {desc && <p className="text-sm text-gray-500 max-w-xl mx-auto leading-relaxed">{desc}</p>}
  </div>
)

/* ── More Button ── */
const MoreBtn = ({ label, to }) => (
  <div className="text-center mt-8">
    <Link to={to} className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-sm font-bold text-black transition-all hover:opacity-85 hover:scale-105"
      style={{ background: 'linear-gradient(135deg,#D4AF37,#F0D060)', boxShadow: '0 0 20px rgba(212,175,55,0.3)' }}>
      {label}
    </Link>
  </div>
)

/* ── Dark Section ── */
const DSection = ({ children, alt = false }) => (
  <div style={{ background: alt ? '#111' : '#0A0A0A', padding: '48px 0', borderBottom: '1px solid #1A1A1A' }}>
    <div className="max-w-7xl mx-auto px-4">{children}</div>
  </div>
)

/* ── Membership Card ── */
const MCard = ({ plan, price, period, features, tr }) => (
  <div className="relative rounded-2xl overflow-visible flex transition-all duration-300 hover:-translate-y-1"
    style={{ background: '#1A1A1A', border: '1px solid #2A2A2A', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
    <div className="flex items-center justify-center w-12 shrink-0 rounded-l-2xl"
      style={{ background: '#D4AF37', writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
      <span className="text-xs font-black text-black uppercase tracking-widest" style={{ transform: 'rotate(180deg)' }}>{plan}</span>
    </div>
    <div className="flex-1 p-5">
      <div className="mb-1">
        <span className="text-3xl font-black text-white">{price}</span>
        <span className="text-xs text-gray-500 ml-1">/ {period}</span>
      </div>
      <ul className="space-y-1.5 mb-5">
        {features.map(f => (
          <li key={f} className="flex items-center gap-2 text-xs text-gray-400">
            <CheckCircle2 size={13} className="text-[#D4AF37] shrink-0" /> {f}
          </li>
        ))}
        <li>
          <Link to="/register" className="text-xs font-semibold flex items-center gap-1" style={{ color: '#D4AF37' }}>
            <CheckCircle2 size={13} className="text-[#D4AF37] shrink-0" /> {tr('member_read')}
          </Link>
        </li>
      </ul>
      <Link to="/register"
        className="block text-center py-2.5 rounded-full text-xs font-black text-black transition-all hover:opacity-85"
        style={{ background: 'linear-gradient(135deg,#D4AF37,#F0D060)' }}>
        {tr('member_subscribe')}
      </Link>
    </div>
  </div>
)

/* ── Article Card ── */
const ACard = ({ title, date, imgBg }) => (
  <Link to="/products" className="group block rounded-xl overflow-hidden transition-all duration-200 hover:-translate-y-1"
    style={{ background: '#1A1A1A', border: '1px solid #2A2A2A', boxShadow: '0 2px 8px rgba(0,0,0,0.4)' }}
    onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(212,175,55,0.35)'}
    onMouseLeave={e => e.currentTarget.style.borderColor = '#2A2A2A'}>
    <div className="relative overflow-hidden" style={{ height: 140, background: imgBg || '#111' }}>
      <div className="absolute inset-0 flex items-center justify-center">
        <BookOpen size={32} className="text-white opacity-20" />
      </div>
      <div className="absolute top-2 left-2 text-[10px] font-bold text-white bg-black/60 px-2 py-0.5 rounded">{date}</div>
      <div className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center"
        style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.15)' }}>
        <Share2 size={10} className="text-gray-300" />
      </div>
    </div>
    <div className="p-3">
      <p className="text-sm font-semibold text-gray-300 group-hover:text-[#D4AF37] transition-colors line-clamp-2 leading-snug">{title}</p>
    </div>
  </Link>
)

/* ── Scroll Top ── */
const ScrollTop = () => {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const fn = () => setShow(window.scrollY > 400)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])
  if (!show) return null
  return (
    <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-6 right-6 z-50 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
      style={{ background: '#e53e3e', boxShadow: '0 4px 12px rgba(229,62,62,0.4)' }}>
      <ArrowUp size={18} className="text-white" />
    </button>
  )
}

/* ══════════════════════════════════════════════════════════
   MAIN
══════════════════════════════════════════════════════════ */
export default function HomePage() {
  const [trending,   setTrending]   = useState([])
  const [featured,   setFeatured]   = useState([])
  const [newest,     setNewest]     = useState([])
  const [free,       setFree]       = useState([])
  const [categories, setCategories] = useState([])
  const [loading,    setLoading]    = useState(true)
  const [featTab,    setFeatTab]    = useState(0)
  const { tr } = useLang()

  useEffect(() => {
    Promise.all([
      productService.getAll({ status: 'active', section: 'trending' }),
      productService.getAll({ status: 'active', section: 'featured' }),
      productService.getAll({ status: 'active', section: 'newest' }),
      productService.getAll({ status: 'active', section: 'free' }),
      categoryService.getAll(),
    ]).then(([t, f, n, fr, c]) => {
      setTrending(t.data.data)
      setFeatured(f.data.data)
      setNewest(n.data.data)
      setFree(fr.data.data)
      setCategories(c.data.data)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  if (loading) return <PageLoader />

  const getSales = (id) => [13, 21, 13, 17, 11, 18, 16, 15, 12, 8][id % 10]
  const getBadge = p => {
    if (!p.price || p.price < 1000) return 'Free'
    if (p.price < 500000) return 'Lite'
    if (p.price < 3000000) return 'Star'
    return 'Dev'
  }
  const isDl = p => !p.price || Number(p.price) < 1000

  const catTabs = categories.slice(0, 3)

  // Featured filter per tab kategori
  const getFeaturedByTab = (tabIndex) => {
    if (!catTabs[tabIndex]) return featured
    const catId = catTabs[tabIndex].id
    const filtered = featured.filter(p => p.category_id === catId)
    return filtered.length >= 2 ? filtered : featured
  }

  const FREE_NAMES = [
    'Tianma Pro','Ziyuan Pro','Fiverpro Nexus','inBefore Pro','Monopoly Lite','Casino77 Pro',
    'DG Version','Netfox Pro','Duckbet Nexus','Nexus Off Game','Vietna Hit667','MPClub77 Pro',
    'Goldsvet 1Win','Monopoly Pro',
  ]

  const ART_COLORS = ['#1a2a1a','#1a1a2a','#0a1a2a','#1a0a1a','#2a1a0a']
  const ARTICLES = [
    { title: 'Tips Memilih Produk Berkualitas dengan Harga Terbaik', date: '06 June 2026' },
    { title: 'Panduan Lengkap Belanja Online Aman dan Terpercaya', date: '06 June 2026' },
    { title: 'Demo Fitur Lengkap Panel Admin Toko Online Modern', date: '24 May 2026' },
    { title: 'Daftar Fitur Unggulan Platform Belanja All-in-One', date: '24 May 2026' },
    { title: 'Jasa Pembuatan Toko Online Profesional Semua Kategori', date: '01 June 2026' },
  ]

  const PLANS = [
    { plan: 'LITE', price: '$99', period: '1 Year', features: ['Active for 360 days','100 downloads per day','360 total downloads','Free updates for 1 year','Includes new products','Free products only','Extended license'] },
    { plan: 'STAR', price: '$2K', period: '2 Year', features: ['Active for 720 days','200 downloads per day','770 total downloads','Free updates for 2 years','Includes new products','Special products only','Extended license'] },
    { plan: 'DEV', price: '$10K', period: '4 Year', features: ['Active for 1440 days','400 downloads per day','1440 total downloads','Free updates for 4 years','Includes new products','Free for all products','Extended license'] },
  ]

  return (
    <div style={{ background: '#0A0A0A', paddingTop: 56 }}>
      <TopNav />
      <Hero />
      <ScrollTop />

      {/* TRENDING */}
      <DSection>
        <SHead icon={Heart} title={tr('trending_title')} desc={tr('trending_desc')} />
        {trending.length === 0
          ? <p className="text-center text-gray-600 py-10 text-sm">{tr('no_products')}</p>
          : <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {trending.map(p => <PCard key={p.id} product={p} badge={getBadge(p)} salesCount={getSales(p.id)} downloaded={isDl(p)} />)}
            </div>
        }
        <MoreBtn label={tr('trending_more')} to="/products" />
      </DSection>

      {/* FEATURED */}
      <DSection alt>
        <SHead icon={Star} title={tr('featured_title')} desc={tr('featured_desc')} />
        {catTabs.length > 0 && (
          <div className="flex items-center justify-center gap-2 mb-6 flex-wrap">
            {catTabs.map((cat, i) => (
              <button key={cat.id} onClick={() => setFeatTab(i)}
                className="px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200"
                style={featTab === i
                  ? { background: '#D4AF37', color: '#000', boxShadow: '0 0 16px rgba(212,175,55,0.4)' }
                  : { background: '#1A1A1A', color: '#9ca3af', border: '1px solid #2A2A2A' }}>
                {cat.name}
              </button>
            ))}
          </div>
        )}
        {featured.length === 0
          ? <p className="text-center text-gray-600 py-10 text-sm">{tr('no_products')}</p>
          : <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {getFeaturedByTab(featTab).map(p => <PCard key={p.id} product={p} badge={getBadge(p)} salesCount={getSales(p.id)} downloaded={isDl(p)} />)}
            </div>
        }
        <div className="flex items-center justify-center gap-3 mt-8">
          <Link to="/products"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-sm font-bold transition-all"
            style={{ background: '#1A1A1A', color: '#9ca3af', border: '1px solid #2A2A2A' }}>
            {tr('featured_related')}
          </Link>
          <Link to="/products"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-sm font-bold text-black transition-all hover:opacity-85"
            style={{ background: 'linear-gradient(135deg,#D4AF37,#F0D060)', boxShadow: '0 0 16px rgba(212,175,55,0.3)' }}>
            {tr('featured_more')}
          </Link>
        </div>
      </DSection>

      {/* NEWEST */}
      <DSection>
        <SHead icon={Tag} title={tr('newest_title')} desc={tr('newest_desc')} />
        {newest.length === 0
          ? <p className="text-center text-gray-600 py-10 text-sm">{tr('no_products')}</p>
          : <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {newest.map(p => <PCard key={p.id} product={p} badge={getBadge(p)} salesCount={getSales(p.id)} downloaded={isDl(p)} />)}
            </div>
        }
        <MoreBtn label={tr('newest_more')} to="/products" />
      </DSection>

      {/* FREE */}
      <DSection alt>
        <SHead icon={Gift} title={tr('free_title')} desc={tr('free_desc')} />
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
          {FREE_NAMES.map((name, i) => (
            <FreeCard key={name} name={name} product={free[i] || null} />
          ))}
        </div>
        <MoreBtn label={tr('free_more')} to="/products" />
      </DSection>

      {/* MEMBERSHIP */}
      <DSection>
        <SHead icon={Download} title={tr('member_title')} desc={tr('member_desc')} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto">
          {PLANS.map(plan => <MCard key={plan.plan} {...plan} tr={tr} />)}
        </div>
        <p className="text-xs text-gray-600 mt-5 leading-relaxed max-w-2xl mx-auto text-center">
          {tr('member_note')}{' '}
          <Link to="/register" style={{ color: '#D4AF37' }} className="hover:underline font-semibold">{tr('member_read')}</Link>
        </p>
        <MoreBtn label={tr('member_more')} to="/register" />
      </DSection>

      {/* ARTICLES */}
      <DSection alt>
        <SHead icon={Rss} title={tr('articles_title')} desc={tr('articles_desc')} />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {ARTICLES.map((a, i) => <ACard key={a.title} {...a} imgBg={ART_COLORS[i % ART_COLORS.length]} />)}
        </div>
        <MoreBtn label={tr('articles_more')} to="/products" />
      </DSection>

      {/* FOOTER */}
      <div style={{ background: '#111', position: 'relative', borderTop: '1px solid #1A1A1A' }}>
        <div style={{ lineHeight: 0, background: '#0A0A0A' }}>
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
            <path d="M0,0 C120,80 240,80 360,40 C480,0 600,80 720,60 C840,40 960,80 1080,50 C1200,20 1320,70 1440,40 L1440,80 L0,80 Z" fill="#111"/>
          </svg>
        </div>

        <div className="max-w-6xl mx-auto px-6 pt-6 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            {/* About */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Info size={14} className="text-gray-300" />
                <h4 className="text-sm font-bold text-white">{tr('footer_about')}</h4>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed mb-5">{tr('footer_about_desc')}</p>
              <div className="mb-3">
                <span className="text-xl font-black italic tracking-wide"
                  style={{ background: 'linear-gradient(90deg,#D4AF37,#F0D060,#B8960C)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  LowEngine
                </span>
              </div>
              <p className="text-xs text-gray-500 mb-4">{tr('footer_connect')}</p>
              <div className="flex items-center gap-2">
                {[
                  { Icon: Youtube, color: '#ff0000' },
                  { Icon: Facebook, color: '#1877f2' },
                  { Icon: Twitter, color: '#1da1f2' },
                  { Icon: Send, color: '#0088cc' },
                  { Icon: Instagram, color: '#e1306c' },
                ].map(({ Icon, color }, i) => (
                  <a key={i} href="#"
                    className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                    style={{ background: '#333', border: '1px solid #444' }}
                    onMouseEnter={e => e.currentTarget.style.background = color}
                    onMouseLeave={e => e.currentTarget.style.background = '#333'}>
                    <Icon size={14} className="text-gray-300" />
                  </a>
                ))}
                {/* WhatsApp */}
                <a href="#"
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                  style={{ background: '#333', border: '1px solid #444' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#25d366'}
                  onMouseLeave={e => e.currentTarget.style.background = '#333'}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" fill="#9ca3af"/>
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.978-1.404A9.953 9.953 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a7.95 7.95 0 01-4.071-1.115l-.29-.174-3.007.847.854-2.927-.19-.301A7.96 7.96 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" fill="#9ca3af"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Support Center */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <BookOpen size={14} className="text-gray-300" />
                <h4 className="text-sm font-bold text-white">{tr('footer_support')}</h4>
              </div>
              <ul className="space-y-2">
                {[
                  { key: 'footer_contact', to: '/products' },
                  { key: 'footer_about_link', to: '/products' },
                  { key: 'footer_download', to: '/products' },
                  { key: 'footer_membership', to: '/register' },
                  { key: 'footer_privacy', to: '/products' },
                  { key: 'footer_terms', to: '/products' },
                  { key: 'footer_licenses', to: '/products' },
                ].map(({ key, to }) => (
                  <li key={key}>
                    <Link to={to} className="text-xs text-gray-400 hover:text-white transition-colors">{tr(key)}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Categories */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Tag size={14} className="text-gray-300" />
                <h4 className="text-sm font-bold text-white">{tr('footer_categories')}</h4>
              </div>
              <ul className="space-y-2">
                {categories.length > 0
                  ? categories.slice(0, 3).map(c => (
                      <li key={c.id}>
                        <Link to={`/products?category_id=${c.id}`} className="text-xs text-gray-400 hover:text-white transition-colors">{c.name}</Link>
                      </li>
                    ))
                  : ['Slot Game Script','Sportsbook Script','Casino Game Script'].map(l => (
                      <li key={l}><Link to="/products" className="text-xs text-gray-400 hover:text-white transition-colors">{l}</Link></li>
                    ))
                }
                <li><Link to="/products" className="text-xs text-gray-400 hover:text-white transition-colors">{tr('footer_all_cat')}</Link></li>
              </ul>
            </div>

            {/* Product Filters */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 size={14} className="text-gray-300" />
                <h4 className="text-sm font-bold text-white">{tr('footer_filters')}</h4>
              </div>
              <ul className="space-y-2">
                {[
                  { key: 'footer_flash', to: '/products' },
                  { key: 'footer_featured', to: '/products' },
                  { key: 'footer_trending', to: '/products' },
                  { key: 'footer_newest', to: '/products' },
                  { key: 'footer_free', to: '/products' },
                  { key: 'footer_all_filters', to: '/products' },
                ].map(({ key, to }) => (
                  <li key={key}>
                    <Link to={to} className="text-xs text-gray-400 hover:text-white transition-colors">{tr(key)}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid #222' }}>
          <div className="max-w-6xl mx-auto px-6 py-4">
            <div className="flex items-center justify-center gap-6 mb-3 flex-wrap">
              {[
                { key: 'footer_bottom_membership', to: '/register' },
                { key: 'footer_bottom_affiliate', to: '/products' },
                { key: 'footer_bottom_blog', to: '/products' },
                { key: 'footer_bottom_member', to: '/login' },
                { key: 'footer_bottom_guest', to: '/register' },
                { key: 'footer_bottom_lang', to: '/' },
              ].map(({ key, to }) => (
                <Link key={key} to={to} className="text-xs text-gray-500 hover:text-white transition-colors">{tr(key)}</Link>
              ))}
            </div>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <p className="text-xs text-gray-600">{tr('footer_copyright')}</p>
              <span className="text-gray-700 text-xs">·</span>
              <p className="text-xs text-gray-600">{tr('footer_powered')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
