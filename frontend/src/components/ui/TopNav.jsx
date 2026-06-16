import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Search, SlidersHorizontal, Percent, BookOpen,
  ShoppingCart, User, Star, Tag, Package, ArrowRight
} from 'lucide-react'
import { useCart } from '../../hooks/useCart'
import { useAuth } from '../../hooks/useAuth'
import { useLang } from '../../hooks/useLang'
import { LANG_LIST } from '../../utils/i18n'

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

export default function TopNav() {
  const navigate  = useNavigate()
  const { totalItems, cart } = useCart()
  const { user, logout }     = useAuth()
  const { lang, setLang, tr } = useLang()

  const [openMenu,   setOpenMenu]   = useState(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const [q,          setQ]          = useState('')

  useEffect(() => {
    const fn = (e) => { if (!e.target.closest('[data-nav]')) setOpenMenu(null) }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [])

  const toggle = (key) => setOpenMenu(prev => prev === key ? null : key)
  const close  = ()    => setOpenMenu(null)

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
    { label: tr('prod_slot'),   to: '/category?category=&name=Slot Game Script' },
    { label: tr('prod_sport'),  to: '/category?category=&name=Sportsbook Script' },
    { label: tr('prod_casino'), to: '/category?category=&name=Casino Game Script' },
  ]
  const OFFERS_ITEMS = [
    { label: tr('offer_membership'), to: '/membership' },
    { label: tr('offer_affiliate'),  to: '/products'   },
    { label: tr('offer_services'),   to: '/services'   },
    { label: tr('offer_promo'),      to: '/products'   },
  ]
  const CONTENT_ITEMS = [
    { label: tr('content_latest'),      to: '/products' },
    { label: tr('content_category'),    to: '/products' },
    { label: tr('content_search'),      to: '/products' },
    { label: tr('content_articles'),    to: '/products' },
    { label: tr('content_article_cat'), to: '/products' },
    { label: tr('content_search_art'),  to: '/products' },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 h-14"
      style={{ background: 'rgba(8,8,8,0.98)', borderBottom: '2px solid #D4AF37' }}>

      {/* Logo */}
      <Link to="/" className="flex items-center shrink-0">
        <span className="text-xl font-black italic tracking-wide"
          style={{ background: 'linear-gradient(90deg,#D4AF37,#F0D060,#B8960C)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          LowEngine
        </span>
      </Link>

      {/* Right menu */}
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
