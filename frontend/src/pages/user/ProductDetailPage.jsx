import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  Star, Heart, ShoppingCart, ShoppingBasket, Share2,
  Package, ChevronRight, Search, Tag, CheckCircle2,
  Youtube, Facebook, Twitter, Send, Instagram, Globe
} from 'lucide-react'
import productService from '../../services/productService'
import api from '../../utils/api'
import reviewService from '../../services/reviewService'
import { useCart } from '../../hooks/useCart'
import { useAuth } from '../../hooks/useAuth'
import { formatRupiah, formatDate } from '../../utils/format'
import { PageLoader } from '../../components/ui/LoadingSpinner'
import toast from 'react-hot-toast'

/* ── Small related product card ── */
const RelatedCard = ({ product }) => {
  const imgUrl = product.image ? `/uploads/products/${product.image}` : null
  const isFree = !product.price || product.price < 1000
  const priceText = isFree ? 'Gratis' : `Rp ${Number(product.price).toLocaleString('id-ID')}`
  return (
    <Link to={`/products/${product.slug}`}
      className="flex gap-3 p-3 rounded-xl transition-all group"
      style={{ background: '#1A1A1A', border: '1px solid #2A2A2A' }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(212,175,55,0.35)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = '#2A2A2A'}>
      <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0" style={{ background: '#111' }}>
        {imgUrl
          ? <img src={imgUrl} alt={product.name} className="w-full h-full object-cover" />
          : <div className="w-full h-full flex items-center justify-center"><Package size={20} className="text-gray-700" /></div>
        }
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-gray-300 group-hover:text-[#D4AF37] transition-colors line-clamp-2 leading-snug mb-1">
          {product.name}
        </p>
        {product.Category && (
          <span className="text-[10px] px-1.5 py-0.5 rounded font-semibold"
            style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37' }}>
            {product.Category.name}
          </span>
        )}
        <p className="text-xs font-black text-white mt-1">{priceText}</p>
        <div className="flex gap-1 mt-1">
          <button className="w-5 h-5 rounded flex items-center justify-center" style={{ background: '#166534' }}>
            <ShoppingCart size={10} className="text-green-400" />
          </button>
          <button className="w-5 h-5 rounded flex items-center justify-center" style={{ background: 'rgba(59,130,246,0.2)' }}>
            <ShoppingBasket size={10} className="text-blue-400" />
          </button>
          <button className="w-5 h-5 rounded flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.2)' }}>
            <Heart size={10} className="text-red-400" />
          </button>
        </div>
      </div>
    </Link>
  )
}

export default function ProductDetailPage() {
  const { slug }     = useParams()
  const navigate     = useNavigate()
  const { addToCart } = useCart()
  const { user }     = useAuth()

  const [product,   setProduct]   = useState(null)
  const [gallery,   setGallery]   = useState([])
  const [content,   setContent]   = useState(null)
  const [related,   setRelated]   = useState([])
  const [loading,   setLoading]   = useState(true)
  const [activeTab, setActiveTab] = useState('description')
  const [wished,    setWished]    = useState(false)
  const [searchTag, setSearchTag] = useState('')
  const [lightbox,  setLightbox]  = useState({ open: false, index: 0 })

  // Voting
  const storageKey = product ? `vote_${product.id}` : ''
  const [userVote,  setUserVote]  = useState(0)
  const [hoverStar, setHoverStar] = useState(0)

  useEffect(() => {
    if (product) {
      const saved = parseInt(localStorage.getItem(`vote_${product.id}`)) || 0
      setUserVote(saved)
    }
  }, [product])

  useEffect(() => {
    setLoading(true)
    productService.getOne(slug)
      .then(r => {
        setProduct(r.data.data)
        const productData = r.data.data
        // fetch gallery terpisah
        api.get(`/gallery/product/${productData.id}`)
          .then(gr => setGallery(gr.data.data))
          .catch(() => setGallery([]))
        // fetch content terpisah
        api.get(`/product-content/${productData.id}`)
          .then(cr => setContent(cr.data.data))
          .catch(() => setContent(null))
        // fetch related by category
        if (productData?.category_id) {
          productService.getAll({ category_id: productData.category_id, status: 'active' })
            .then(rr => setRelated(rr.data.data.filter(p => p.slug !== slug).slice(0, 5)))
        }
      })
      .catch(() => navigate('/products'))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) return <PageLoader />
  if (!product) return null

  const imgUrl = product.image ? `/uploads/products/${product.image}` : null
  const reviewRating = product.Reviews?.length ? product.Reviews.reduce((s, r) => s + r.rating, 0) / product.Reviews.length : 0
  const displayFilled = hoverStar || userVote || Math.round(reviewRating)
  const isFree  = !product.price || product.price < 1000
  const priceText = isFree ? 'Gratis' : `Rp ${Number(product.price).toLocaleString('id-ID')}`
  const sales   = [13,21,13,17,11,18,16,15,12,8][product.id % 10]
  const views   = Math.floor((product.id * 1847 + 3291) % 8000) + 1200

  const handleVote = (star) => {
    const next = userVote === star ? 0 : star
    setUserVote(next)
    try { next > 0 ? localStorage.setItem(`vote_${product.id}`, String(next)) : localStorage.removeItem(`vote_${product.id}`) } catch {}
    toast.success(next > 0 ? `Rating ${next} bintang diberikan!` : 'Rating dihapus')
  }

  const handleCart = () => {
    if (!product.stock) { toast.error('Stok habis'); return }
    addToCart(product, 1)
    toast.success('Ditambahkan ke keranjang!')
  }

  const handleCollect = () => navigate('/membership')

  const DETAIL_ROWS = [
    { label: 'Category',    value: product.Category?.name || '-' },
    { label: 'Harga',       value: priceText },
    { label: 'Stok',        value: `${product.stock} Item` },
    { label: 'Terjual',     value: `${sales} Item` },
    { label: 'Updated',     value: formatDate(product.updated_at) },
    { label: 'Rating',      value: null, isRating: true },
  ]

  const FEATURES = [
    'Tanpa harus paham coding, instalasi mudah & lengkap',
    'Lifetime free update (tipe yang games)',
    'Tanpa biaya berlangganan apapun',
    'Gameplay bisa covering slot (no rtp)',
    'Semua games aktif tanpa langganan',
    'Full support, instalasi & konfigurasi lengkap',
    'Transaksi menggunakan apapun di old script',
    'Web & modul aman tanpa bug',
    'Fitur web lengkap (all demo)',
    'Dokumentasi lengkap',
  ]

  const TABLE_OF_CONTENTS = [
    'Kemudahan & Keamanan',
    'Demo Lengkap',
    'Fitur Unggulan LowEngine',
    'Sistem Yang Terintegrasi',
    'Fitur Umum',
    'Halaman & Fitur Front End',
    'Halaman & Fitur Member',
    'Halaman & Fitur Admin',
    'Halaman & Fitur Super Admin',
    'Halaman & Fitur Gameplay',
    'Kategori Game Betting',
    'Fitur UI/UX Website',
    'Fitur SEO yang Dioptimalkan',
    'Validasi SEO yang Digunakan',
    'Daftar Provider Games',
  ]

  const CONTENT_SECTIONS = [
    { title: 'Demo Lengkap Tampilan Website', items: content?.demo_links?.length > 0
      ? content.demo_links
      : [
          { text: 'Nexus', url: 'https://nexus.scatterwin.net/' },
          { text: 'Telo',  url: 'https://telo.scatterwin.net/'  },
          { text: 'Hanzo', url: 'https://hanzo.scatterwin.net/' },
        ]
    },
    { title: 'Fitur Unggulan', items: ['Support multi domain 1 database (extended)','Gameplay bisa disetting win/loss (rtp)','Akun agen provider api unlimited','Free api 60+ provider games','6500+ total games','60+ market togel & 10+ jenis betting','Auto update data api, games, dan provider terbaru','Payment gateways (bank, e-wallet & qris)','Payment manual (bank, e-wallet, qris, paypal, crypto, pulsa, dll)','Sistem deposit via voucher','3 level pengguna sistem (member, admin, super admin)','Sistem turnover & promo deposit new member','Sistem referral / afiliasi & verifikasi KYC','Pengaturan bonus registrasi, deposit, rolling, new member','Terintegrasi WA Sender Pro & Telegram Bot'] },
    { title: 'Sistem Yang Terintegrasi', items: ['4 provider api games (nexus, telo, hanzoslot staging & production)','Provider market togel auto update','Gameplay api idr (transfer fund)','18 payment gateways idr, usd & crypto','Whatsapp gateways wa sender pro','Telegram bot notification','Url shortener (safelink, bit.ly, tinyurl, is.gd, v.gd)'] },
    { title: 'Fitur Umum', items: ['Multi bahasa (frontend, backend & member)','Multi color & desain theme, custom theme & font','Auto cek data api transaksi & status game provider (realtime)','Info progressive jackpot & rtp game slot max win','Info game slot & casino terpopuler, daftar provider games','Halaman statis, promosi, dan artikel blog','Banner slider responsive (desktop, tablet, mobile)','SEO friendly dan UI/UX yang dioptimalkan','Terintegrasi dengan Google reCAPTCHA','Sistem keamanan yang optimal','Notifikasi realtime via email, whatsapp & telegram'] },
    { title: 'Halaman & Fitur Front End', items: ['Home page & Landing page amp, seo & responsive','Halaman game slots, casino, togel, sports','Halaman jadwal togel, livedraw togel, rtp slots','Info keluaran togel, slot max win, casino terpopuler','Info daftar provider, promosi dan event','Halaman referral, kontak, statis, pencarian'] },
    { title: 'Halaman & Fitur Member', items: ['Dashboard akun, pengaturan profil & keamanan','Pengaturan metode pembayaran','Halaman deposit, withdraw, invoice deposit & withdraw','Laporan withdraw, riwayat transaksi, bonus, gameplay, taruhan','Halaman referral, daftar referral & komisi','Halaman verifikasi KYC'] },
    { title: 'Halaman & Fitur Admin', items: ['Dashboard default, dark, statistik, custom dashboard','Statistik laporan keuangan & pengaturan profil','Kelola provider game, daftar game, market togel','Monitoring room & kontrol gameplay','Kelola promosi, event, halaman statis','Kelola member, deposit, withdraw, laporan transaksi','Export laporan ke excel','Kelola pop up, iklan slider, sosial media, livechat'] },
    { title: 'Halaman & Fitur Super Admin', items: ['Semua fitur admin','Riwayat dan laporan keuangan lengkap','Kelola saldo member, metode deposit, voucher, KYC','Kelola sistem komisi & bonus (registrasi, deposit, rolling, cashback)','Kelola whatsapp gateways & telegram bot','Kelola template website, tema, warna, font','Preview template & halaman spesifikasi server'] },
    { title: 'Halaman & Fitur Gameplay', items: ['Halaman memulai game, game demo','Halaman game slots, casino, sports, e-games, fishing'] },
    { title: 'Kategori Game Betting', items: ['Slots online','Casino live','Togel betting','Sports betting','Egames betting','Fishing betting'] },
    { title: 'Fitur UI/UX Website', items: ['Halaman responsive semua perangkat','Jenis game yang dikategorikan','Mode dark dan light (admin panel)','Terintegrasi dengan Google Font','Multi template & tema, multi warna custom'] },
    { title: 'Fitur SEO yang Dioptimalkan', items: ['Auto Bintang 5 Di Mesin Pencari (Google, Bing, Yandex)','Support PWA / Progressive Web App','Generate Sitemap.xml & RSS.xml Otomatis','SEO Friendly & UI/UX Modern','Support Lazyload & Lazysizes Images','SEO Opengraph Meta Data','Card Validator Twitter, Facebook Crawler, Rich Pins Pinterest','Valid Schema.org (Schema Markup)','Valid Mobile Friendly Test & Pages Speed Insights'] },
    { title: 'Validasi SEO yang Digunakan', items: ['Google Pagespeed Insight','Grade A Gtmetrix','Valid Mobile Friendly','Valid Schema.org Data Terstruktur','Valid Pengujian Hasil Kaya Google Search','Valid OG Data Twitter Card, Facebook Sharing, Pinterest Sharing'] },
    { title: 'Daftar Provider Games', items: ['4D Lottery','AFB Casino','AFB Sport','ALLBET','Advant Play','Amatic','Amusnet','Arcade Fishing','Bbin Fishing','Booongo','CMD368','CQ9 Gaming','Dream Gaming','Dreamtech','EGT Digital','Evo Play','Evolution','Ezugi Live','Fachai','Fastspin','Fat Panda','Fun Gaming','Habanero','Hacksaw','IA Sport','JDB Gaming','Jili Gaming','Joker','Micro Gaming','N2Live Casino','OG Casino','PG Soft','Play N Go','Playson','Pragmatic','QQ Keno','SBO Slot','SBO Sport','SV388 Cockfight','Sexy Gaming','Spade Gaming','Spribe Casino','Toptrend Gaming','WM Casino','WS168 Cockfight','Yggdrasil','dan masih banyak lagi...'] },
  ]

  const POPULAR_TAGS = ['slot script','casino slot','jasa slot','source code slot','buat slot','slot online','web slot','casino']

  return (
    <div style={{ background: '#0A0A0A', minHeight: '100vh' }}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-6 flex-col lg:flex-row">

          {/* ══ LEFT MAIN CONTENT ══════════════════════════════ */}
          <div className="flex-1 min-w-0">

            {/* Product header card */}
            <div className="rounded-xl overflow-hidden mb-6" style={{ background: '#1A1A1A', border: '1px solid #2A2A2A' }}>
              <div className="flex flex-col md:flex-row gap-6 p-6">
                {/* Main image */}
                <div className="w-full md:w-64 shrink-0">
                  <div className="rounded-xl overflow-hidden aspect-video md:aspect-square" style={{ background: '#111' }}>
                    {imgUrl
                      ? <img src={imgUrl} alt={product.name} className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center">
                          <Package size={48} className="text-gray-700" />
                        </div>
                    }
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1">
                  <h1 className="text-xl font-black text-white mb-4 leading-snug">{product.name}</h1>
                  <table className="w-full text-sm">
                    <tbody>
                      {DETAIL_ROWS.map(row => (
                        <tr key={row.label} style={{ borderBottom: '1px solid #2A2A2A' }}>
                          <td className="py-2 pr-4 text-gray-500 w-28 font-medium">{row.label}</td>
                          <td className="py-2 text-white font-semibold">
                            {row.isRating ? (
                              <div className="flex items-center gap-1">
                                {[1,2,3,4,5].map(s => (
                                  <button key={s} onClick={() => handleVote(s)}
                                    onMouseEnter={() => setHoverStar(s)} onMouseLeave={() => setHoverStar(0)}
                                    style={{ background: 'none', border: 'none', padding: '1px', cursor: 'pointer' }}>
                                    <Star size={14} className={s <= displayFilled ? 'text-[#D4AF37] fill-[#D4AF37]' : 'text-gray-700'} style={{ transition: 'all 0.15s' }} />
                                  </button>
                                ))}
                                {userVote > 0 && <span className="text-xs text-gray-500 ml-1">({userVote}/5)</span>}
                              </div>
                            ) : row.value}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Action buttons */}
                  <div className="flex gap-2 mt-5 flex-wrap">
                    <button onClick={handleCart}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-white transition-all hover:opacity-85"
                      style={{ background: '#166534' }}>
                      <ShoppingCart size={14} /> Add
                    </button>
                    <button
                      onClick={() => navigate('/buy-now', { state: { product } })}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all hover:opacity-85"
                      style={{ background: 'linear-gradient(135deg,#D4AF37,#F0D060)', color: '#000' }}>
                      <ShoppingCart size={14} className="text-black" />
                      <span className="text-black">Buy Now</span>
                    </button>
                    <button onClick={handleCollect}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all"
                      style={{ background: 'rgba(59,130,246,0.15)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.3)' }}>
                      <ShoppingBasket size={14} /> Demo
                    </button>
                    <button
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all"
                      style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.3)' }}>
                      FAQ
                    </button>
                    <button onClick={() => { setWished(!wished); toast.success(wished ? 'Dihapus wishlist' : 'Ke wishlist!') }}
                      className="flex items-center justify-center w-9 h-9 rounded-lg transition-all"
                      style={{ background: wished ? 'rgba(239,68,68,0.3)' : 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)' }}>
                      <Heart size={14} className={wished ? 'fill-red-400 text-red-400' : 'text-red-400'} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Language selector (decorative) */}
            <div className="flex items-center justify-between px-4 py-3 rounded-xl mb-6"
              style={{ background: '#1A1A1A', border: '1px solid #2A2A2A' }}>
              <div className="flex items-center gap-2">
                <Globe size={14} className="text-gray-400" />
                <span className="text-sm text-gray-400">Select Language</span>
              </div>
              <span className="text-gray-600 text-xs">Powered by LowEngine</span>
            </div>

            {/* Tab navigation */}
            <div className="flex gap-1 mb-6 border-b" style={{ borderColor: '#2A2A2A' }}>
              {['description','faq','comments','reviews'].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className="px-4 py-2.5 text-sm font-semibold capitalize transition-all rounded-t-lg"
                  style={activeTab === tab
                    ? { background: '#D4AF37', color: '#fff', border: '1px solid #D4AF37', borderBottom: 'none' }
                    : { color: '#9ca3af' }}>
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="rounded-xl p-6" style={{ background: '#1A1A1A', border: '1px solid #2A2A2A' }}>

              {/* Description tab */}
              {activeTab === 'description' && (
                <div>
                  {/* Screenshot gallery dari API */}
                  {gallery.length > 0 && (
                    <div className="flex gap-2 flex-wrap mb-6">
                      {gallery.map((item, i) => (
                        <div key={item.id}
                          className="w-20 h-16 rounded-lg overflow-hidden cursor-pointer transition-all hover:scale-105 hover:opacity-100"
                          style={{ background: '#111', border: '1px solid #2A2A2A', opacity: 0.85 }}
                          onClick={() => setLightbox({ open: true, index: i })}>
                          <img src={`/uploads/gallery/${item.image}`} alt={`screenshot ${i + 1}`}
                            className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                  {gallery.length === 0 && imgUrl && (
                    <div className="flex gap-2 flex-wrap mb-6">
                      {[1,2,3,4,5,6,7,8].map(i => (
                        <div key={i} className="w-20 h-16 rounded-lg overflow-hidden"
                          style={{ background: '#111', border: '1px solid #2A2A2A' }}>
                          <img src={imgUrl} alt={`screenshot ${i}`}
                            className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* LIGHTBOX MODAL */}
                  {lightbox.open && gallery.length > 0 && (
                    <div
                      className="fixed inset-0 z-[9999] flex items-center justify-center"
                      style={{ background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(8px)' }}
                      onClick={() => setLightbox({ open: false, index: 0 })}>

                      {/* Close */}
                      <button
                        onClick={() => setLightbox({ open: false, index: 0 })}
                        className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center text-white text-xl font-black transition-all hover:scale-110"
                        style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}>
                        ✕
                      </button>

                      {/* Counter */}
                      <div className="absolute top-4 left-1/2 -translate-x-1/2 text-sm text-gray-400 font-semibold">
                        {lightbox.index + 1} / {gallery.length}
                      </div>

                      {/* Prev button */}
                      {lightbox.index > 0 && (
                        <button
                          onClick={e => { e.stopPropagation(); setLightbox(prev => ({ ...prev, index: prev.index - 1 })) }}
                          className="absolute left-4 w-12 h-12 rounded-full flex items-center justify-center text-white text-xl font-black transition-all hover:scale-110"
                          style={{ background: 'rgba(212,175,55,0.2)', border: '1px solid rgba(212,175,55,0.4)' }}>
                          ‹
                        </button>
                      )}

                      {/* Main image */}
                      <img
                        src={`/uploads/gallery/${gallery[lightbox.index]?.image}`}
                        alt={`gallery ${lightbox.index + 1}`}
                        className="max-w-[85vw] max-h-[80vh] rounded-2xl object-contain"
                        style={{ boxShadow: '0 0 60px rgba(0,0,0,0.8)' }}
                        onClick={e => e.stopPropagation()}
                      />

                      {/* Next button */}
                      {lightbox.index < gallery.length - 1 && (
                        <button
                          onClick={e => { e.stopPropagation(); setLightbox(prev => ({ ...prev, index: prev.index + 1 })) }}
                          className="absolute right-4 w-12 h-12 rounded-full flex items-center justify-center text-white text-xl font-black transition-all hover:scale-110"
                          style={{ background: 'rgba(212,175,55,0.2)', border: '1px solid rgba(212,175,55,0.4)' }}>
                          ›
                        </button>
                      )}

                      {/* Thumbnail strip */}
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                        {gallery.map((item, i) => (
                          <div key={item.id}
                            onClick={e => { e.stopPropagation(); setLightbox(prev => ({ ...prev, index: i })) }}
                            className="w-12 h-9 rounded-lg overflow-hidden cursor-pointer transition-all"
                            style={{
                              border: i === lightbox.index ? '2px solid #D4AF37' : '2px solid rgba(255,255,255,0.2)',
                              opacity: i === lightbox.index ? 1 : 0.5,
                            }}>
                            <img src={`/uploads/gallery/${item.image}`} alt={`thumb ${i}`}
                              className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Breadcrumb */}
                  <div className="flex items-center gap-1 text-xs text-gray-600 mb-4 flex-wrap">
                    {['Homepage','Store','Categories',product.Category?.name || 'Produk', product.name].map((b, i, arr) => (
                      <span key={b} className="flex items-center gap-1">
                        <span className={i === arr.length - 1 ? 'text-[#D4AF37]' : 'hover:text-gray-400 cursor-pointer'}>{b}</span>
                        {i < arr.length - 1 && <ChevronRight size={10} />}
                      </span>
                    ))}
                  </div>

                  {/* Title */}
                  <h2 className="text-lg font-black text-white mb-3">{product.name}</h2>

                  {/* Description */}
                  <p className="text-sm text-gray-400 leading-relaxed mb-6 italic">
                    "{product.description || 'Produk berkualitas dengan fitur lengkap dan dukungan teknis penuh.'}"
                  </p>

                  {/* Table of Contents */}
                  <div className="mb-6 p-4 rounded-xl" style={{ background: '#111', border: '1px solid #2A2A2A' }}>
                    <h3 className="text-sm font-bold text-white mb-3">Table of Contents</h3>
                    <ul className="space-y-1">
                      {(content?.table_of_contents?.length > 0 ? content.table_of_contents : TABLE_OF_CONTENTS).map(item => (
                        <li key={item} className="flex items-center gap-2 text-xs" style={{ color: '#D4AF37' }}>
                          <span>•</span> {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Features section */}
                  <div className="mb-6">
                    <h3 className="text-base font-black text-white mb-3">Kemudahan & Keamanan</h3>
                    <ul className="space-y-2">
                      {(content?.features?.length > 0 ? content.features : FEATURES).map(f => (
                        <li key={f} className="flex items-start gap-2 text-sm text-gray-400">
                          <CheckCircle2 size={15} className="text-green-400 shrink-0 mt-0.5" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Full description */}
                  <div className="text-sm text-gray-400 leading-relaxed space-y-3 mb-6">
                    <p>
                      {content?.full_description || product.description || 'Produk ini menyediakan solusi lengkap dan profesional untuk kebutuhan bisnis kamu. Dengan teknologi terkini dan dukungan penuh, kamu bisa langsung menggunakannya tanpa perlu keahlian teknis khusus.'}
                    </p>
                    {!content?.full_description && (
                      <p>
                        Script ini adalah solusi all-in-one yang dirancang untuk memudahkan pengelolaan bisnis online.
                        Dilengkapi dengan berbagai fitur canggih, antarmuka yang intuitif, serta sistem manajemen yang lengkap.
                      </p>
                    )}
                  </div>

                  {/* Content Sections — semua bagian lengkap */}
                  {CONTENT_SECTIONS.map(section => (
                    <div key={section.title} className="mb-6">
                      <h3 className="text-base font-black text-white mb-3 flex items-center gap-2">
                        <span className="w-1 h-4 rounded" style={{ background: '#D4AF37', display: 'inline-block' }} />
                        {section.title}
                      </h3>
                      <ul className="space-y-1.5 ml-3">
                        {section.items.map((item, i) => {
                          const isObj = typeof item === 'object'
                          const text  = isObj ? item.text : item
                          const url   = isObj ? item.url  : null
                          return (
                            <li key={i} className="flex items-start gap-2 text-sm">
                              <span className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full"
                                style={{ background: '#D4AF37', minWidth: 6 }} />
                              <span className="text-gray-400">
                                {text}{' '}
                                {url && (
                                  <a href={url} target="_blank" rel="noreferrer"
                                    className="hover:underline font-medium"
                                    style={{ color: '#e53e3e' }}>
                                    {url}
                                  </a>
                                )}
                              </span>
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  ))}

                  {/* Popular searches */}
                  <div className="mt-8 pt-6" style={{ borderTop: '1px solid #2A2A2A' }}>
                    <p className="text-sm font-bold text-white mb-3">Popular Searches</p>
                    <div className="flex flex-wrap gap-2">
                      {POPULAR_TAGS.map(tag => (
                        <Link key={tag} to={`/category?name=${encodeURIComponent(tag)}`}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:bg-[#D4AF37] hover:text-black"
                          style={{ background: '#111', color: '#9ca3af', border: '1px solid #2A2A2A' }}>
                          {tag}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Reviews tab */}
              {activeTab === 'reviews' && (
                <div>
                  <h3 className="text-base font-black text-white mb-4">
                    Ulasan Pembeli ({product.Reviews?.length || 0})
                  </h3>
                  {!product.Reviews?.length ? (
                    <p className="text-gray-600 text-sm">Belum ada ulasan</p>
                  ) : (
                    <div className="space-y-4">
                      {product.Reviews.map(r => (
                        <div key={r.id} className="p-4 rounded-xl" style={{ background: '#111', border: '1px solid #2A2A2A' }}>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-black"
                                style={{ background: 'linear-gradient(135deg,#D4AF37,#F0D060)' }}>
                                {r.User?.name?.[0]}
                              </div>
                              <span className="text-sm font-semibold text-white">{r.User?.name}</span>
                            </div>
                            <div className="flex gap-0.5">
                              {[1,2,3,4,5].map(s => (
                                <Star key={s} size={12} className={s <= r.rating ? 'text-[#D4AF37] fill-[#D4AF37]' : 'text-gray-700'} />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-gray-400">{r.comment || '-'}</p>
                          <p className="text-xs text-gray-600 mt-1">{formatDate(r.created_at)}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* FAQ tab */}
              {activeTab === 'faq' && (
                <div className="space-y-4">
                  {[
                    { q: 'Apakah ada garansi produk?', a: 'Ya, semua produk bergaransi 7 hari. Jika ada masalah, tim kami siap membantu.' },
                    { q: 'Bagaimana cara instalasi?', a: 'Tersedia panduan instalasi lengkap dan video tutorial. Tim support juga siap membantu proses instalasi.' },
                    { q: 'Apakah ada free update?', a: 'Ya, tersedia update gratis selama masa berlangganan aktif.' },
                    { q: 'Bagaimana sistem pembayaran?', a: 'Mendukung transfer bank, e-wallet (DANA, OVO, GoPay), dan PayPal.' },
                  ].map(item => (
                    <div key={item.q} className="p-4 rounded-xl" style={{ background: '#111', border: '1px solid #2A2A2A' }}>
                      <p className="text-sm font-bold text-white mb-2">{item.q}</p>
                      <p className="text-sm text-gray-400">{item.a}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Comments tab */}
              {activeTab === 'comments' && (
                <div>
                  {user ? (
                    <div className="p-4 rounded-xl mb-4" style={{ background: '#111', border: '1px solid #2A2A2A' }}>
                      <textarea
                        placeholder="Tulis komentar kamu..."
                        className="input-field resize-none w-full mb-3" rows={3}
                      />
                      <button className="btn-primary text-sm px-4 py-2">Kirim Komentar</button>
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl text-center mb-4" style={{ background: '#111', border: '1px solid #2A2A2A' }}>
                      <p className="text-sm text-gray-500 mb-2">Login untuk memberikan komentar</p>
                      <Link to="/login" className="btn-primary text-sm px-4 py-2">Login</Link>
                    </div>
                  )}
                  <p className="text-sm text-gray-600 text-center">Belum ada komentar. Jadilah yang pertama!</p>
                </div>
              )}
            </div>

            {/* Writer info footer */}
            <div className="flex items-center justify-between mt-4 px-2 flex-wrap gap-2">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <span> Written by <span className="text-gray-400">LowEngine Team</span></span>
                <span>•</span>
                <span> {formatDate(product.created_at)}</span>
                <span>•</span>
                <span>❤ {views.toLocaleString('id-ID')} views</span>
              </div>
            </div>
          </div>

          {/* ══ RIGHT SIDEBAR ════════════════════════════════ */}
          <div className="w-full lg:w-72 shrink-0 space-y-4">

            {/* Search */}
            <div className="flex items-center rounded-xl overflow-hidden"
              style={{ background: '#1A1A1A', border: '1px solid #2A2A2A' }}>
              <input type="text" placeholder="Search products..." value={searchTag}
                onChange={e => setSearchTag(e.target.value)}
                className="flex-1 px-3 py-2.5 bg-transparent text-sm text-white placeholder-gray-600 outline-none" />
              <button className="px-3 text-gray-400 hover:text-white transition-colors">
                <Search size={15} />
              </button>
            </div>

            {/* Product Details card */}
            <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #2A2A2A' }}>
              <div className="px-4 py-3 text-sm font-bold text-white text-center"
                style={{ background: 'linear-gradient(135deg,#8B6914,#D4AF37)' }}>
                Product Details
              </div>
              <div className="p-4 space-y-2" style={{ background: '#1A1A1A' }}>
                {[
                  { label: 'Category',    value: product.Category?.name || '-' },
                  { label: 'Views on',    value: views.toLocaleString('id-ID') },
                  { label: 'Updated',     value: formatDate(product.updated_at) },
                  { label: 'Web Server',  value: 'Apache / Litespeed' },
                  { label: 'Framework',   value: 'PHP Native Procedural' },
                  { label: 'Authors',     value: 'LowEngine' },
                  { label: 'Released at', value: formatDate(product.created_at) },
                  { label: 'Posted at',   value: formatDate(product.created_at) },
                  { label: 'Sales',       value: `${sales} Item` },
                  { label: 'Comments',    value: '0' },
                ].map(row => (
                  <div key={row.label} className="flex items-start justify-between text-xs py-1.5"
                    style={{ borderBottom: '1px solid #2A2A2A' }}>
                    <span className="text-gray-500 shrink-0 w-24">{row.label}</span>
                    <span className="text-gray-300 text-right ml-2">{row.value}</span>
                  </div>
                ))}
                {/* Rating row */}
                <div className="flex items-center justify-between text-xs py-1.5">
                  <span className="text-gray-500">Rating</span>
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} size={11} className={s <= displayFilled ? 'text-[#D4AF37] fill-[#D4AF37]' : 'text-gray-700'} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Share on */}
            <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #2A2A2A' }}>
              <div className="px-4 py-3 text-sm font-bold text-white text-center"
                style={{ background: 'linear-gradient(135deg,#8B6914,#D4AF37)' }}>
                Share on
              </div>
              <div className="p-4 flex flex-wrap gap-2 justify-center" style={{ background: '#1A1A1A' }}>
                {[
                  { Icon: Facebook,  color: '#1877f2' },
                  { Icon: Twitter,   color: '#1da1f2' },
                  { Icon: Instagram, color: '#e1306c' },
                  { Icon: Youtube,   color: '#ff0000' },
                  { Icon: Send,      color: '#0088cc' },
                  { Icon: Globe,     color: '#D4AF37'  },
                ].map(({ Icon, color }, i) => (
                  <button key={i}
                    className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110"
                    style={{ background: '#111', border: '1px solid #333' }}
                    onMouseEnter={e => e.currentTarget.style.background = color}
                    onMouseLeave={e => e.currentTarget.style.background = '#111'}>
                    <Icon size={14} className="text-gray-400" />
                  </button>
                ))}
              </div>
            </div>

            {/* Related Items */}
            {related.length > 0 && (
              <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #2A2A2A' }}>
                <div className="px-4 py-3 text-sm font-bold text-white text-center"
                  style={{ background: 'linear-gradient(135deg,#8B6914,#D4AF37)' }}>
                  Related Items
                </div>
                <div className="p-3 space-y-2" style={{ background: '#1A1A1A' }}>
                  {related.map(p => <RelatedCard key={p.id} product={p} />)}
                </div>
              </div>
            )}

            {/* Search Tags */}
            <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #2A2A2A' }}>
              <div className="px-4 py-3 text-sm font-bold text-white text-center"
                style={{ background: 'linear-gradient(135deg,#8B6914,#D4AF37)' }}>
                Search Tags
              </div>
              <div className="p-4 flex flex-wrap gap-2" style={{ background: '#1A1A1A' }}>
                {POPULAR_TAGS.map(tag => (
                  <Link key={tag} to={`/category?name=${encodeURIComponent(tag)}`}
                    className="px-2 py-1 rounded text-[10px] font-semibold transition-all hover:bg-[#D4AF37] hover:text-black"
                    style={{ background: '#111', color: '#9ca3af', border: '1px solid #333' }}>
                    {tag}
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
