import { useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { X, Tag, CreditCard, User, ShoppingBag } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { useCart } from '../../hooks/useCart'
import orderService from '../../services/orderService'
import { formatRupiah } from '../../utils/format'
import toast from 'react-hot-toast'

const PAYMENT_METHODS = ['Qris All Payment', 'Transfer Bank', 'DANA', 'OVO', 'GoPay', 'ShopeePay', 'PayPal']

export default function BuyNowPage() {
  const location  = useLocation()
  const navigate  = useNavigate()
  const { user }  = useAuth()
  const { cart, addToCart } = useCart()

  // Produk bisa dari state (Buy Now) atau dari cart
  const buyNowProduct = location.state?.product
  const items = buyNowProduct ? [{ ...buyNowProduct, quantity: 1 }] : cart

  const [payMethod,    setPayMethod]    = useState('Transfer Bank')
  const [coupon,       setCoupon]       = useState('')
  const [showCoupon,   setShowCoupon]   = useState(false)
  const [address,      setAddress]      = useState(user?.name ? `Untuk: ${user.name}` : '')
  const [loading,      setLoading]      = useState(false)

  const subtotal = items.reduce((s, i) => s + Number(i.price) * (i.quantity || 1), 0)
  const fee      = 15000
  const total    = subtotal + fee

  const handleGuestCheckout = () => {
    navigate('/payment-confirm', {
      state: { product: items[0], payMethod, total, subtotal, fee, address }
    })
  }

  const handleMemberCheckout = () => {
    if (!user) { navigate('/login'); return }
    navigate('/payment-confirm', {
      state: { product: items[0], payMethod, total, subtotal, fee, address }
    })
  }

  const handleCheckout = async () => {
    if (!address.trim()) { toast.error('Isi alamat/catatan dulu'); return }
    setLoading(true)
    try {
      const orderItems = items.map(i => ({ product_id: i.id, quantity: i.quantity || 1 }))
      const res = await orderService.create({
        items: orderItems,
        shipping_address: address,
        notes: `Metode: ${payMethod}${coupon ? ` | Kupon: ${coupon}` : ''}`,
      })
      toast.success('Order berhasil dibuat!')
      navigate(`/orders/${res.data.data.id}`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal membuat order')
    }
    setLoading(false)
  }

  const removeItem = (id) => {
    if (buyNowProduct) {
      navigate(-1)
    }
  }

  if (items.length === 0) {
    return (
      <div style={{ background: '#0A0A0A', minHeight: '100vh' }}>
        <div className="max-w-5xl mx-auto px-4 py-16 text-center">
          <ShoppingBag size={48} className="text-gray-700 mx-auto mb-4" />
          <p className="text-gray-400 mb-6">Tidak ada produk untuk dibeli</p>
          <Link to="/products" className="btn-primary">Lihat Produk</Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: '#0A0A0A', minHeight: '100vh' }}>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex gap-6 flex-col lg:flex-row">

          {/* ── LEFT: Cart items ── */}
          <div className="flex-1 min-w-0 space-y-4">

            {/* Cart header */}
            <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #2A2A2A' }}>
              <div className="px-5 py-4"
                style={{ background: 'linear-gradient(135deg,#8B0000,#cc0000)' }}>
                <h1 className="text-lg font-black text-white">Cart</h1>
                <p className="text-sm text-red-200">
                  You have {items.length} item(s) in your shopping cart.
                </p>
              </div>

              {/* Items */}
              <div style={{ background: '#1A1A1A' }}>
                {items.map((item, i) => {
                  const imgUrl = item.image ? `/uploads/products/${item.image}` : null
                  const isFree = !item.price || item.price < 1000
                  const priceText = isFree ? 'Gratis' : formatRupiah(item.price)
                  return (
                    <div key={item.id}
                      className="flex items-center gap-4 px-5 py-4"
                      style={{ borderBottom: i < items.length - 1 ? '1px solid #2A2A2A' : 'none' }}>
                      {/* Thumbnail */}
                      <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0"
                        style={{ background: '#111', border: '1px solid #333' }}>
                        {imgUrl
                          ? <img src={imgUrl} alt={item.name} className="w-full h-full object-cover" />
                          : <div className="w-full h-full flex items-center justify-center">
                              <ShoppingBag size={20} className="text-gray-600" />
                            </div>
                        }
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <Link to={`/products/${item.slug}`}
                          className="text-sm font-semibold line-clamp-1 hover:underline"
                          style={{ color: '#e53e3e' }}>
                          {item.name}
                        </Link>
                        {item.Category && (
                          <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded mt-1"
                            style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.2)' }}>
                            {item.Category?.name || 'Produk'}
                          </span>
                        )}
                      </div>

                      {/* Price */}
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-sm font-black text-white">{priceText}</span>
                        <button onClick={() => removeItem(item.id)}
                          className="w-6 h-6 rounded flex items-center justify-center text-gray-500 hover:text-red-400 transition-colors"
                          style={{ background: 'rgba(255,255,255,0.05)' }}>
                          <X size={12} />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Shipping address */}
            <div className="card">
              <label className="label">Alamat / Catatan Pengiriman</label>
              <textarea className="input-field resize-none" rows={3}
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="Masukkan alamat lengkap atau catatan untuk penjual..." />
            </div>

          </div>

          {/* ── RIGHT: Summary ── */}
          <div className="w-full lg:w-72 shrink-0 space-y-4">

            {/* Price summary */}
            <div className="rounded-xl overflow-hidden" style={{ background: '#1A1A1A', border: '1px solid #2A2A2A' }}>
              <div className="p-4 space-y-3">
                {[
                  { label: 'Fee',      value: formatRupiah(fee) },
                  { label: 'Subtotal', value: formatRupiah(subtotal) },
                  { label: 'VAT Tax',  value: '0%' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between py-2"
                    style={{ borderBottom: '1px solid #2A2A2A' }}>
                    <span className="text-sm text-gray-400">{label} :</span>
                    <span className="text-sm font-semibold text-white">{value}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm font-bold text-white">Total :</span>
                  <span className="text-sm font-black" style={{ color: '#D4AF37' }}>{formatRupiah(total)}</span>
                </div>
              </div>
            </div>

            {/* Payment methods */}
            <div className="rounded-xl overflow-hidden" style={{ background: '#1A1A1A', border: '1px solid #2A2A2A' }}>
              <div className="p-4">
                <p className="text-xs text-gray-500 font-semibold mb-3 uppercase tracking-widest">Metode Pembayaran</p>
                <div className="flex flex-wrap gap-2">
                  {PAYMENT_METHODS.map(m => (
                    <button key={m} onClick={() => setPayMethod(m)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                      style={payMethod === m
                        ? { background: '#D4AF37', color: '#000' }
                        : { background: '#111', color: '#9ca3af', border: '1px solid #333' }}>
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Checkout buttons */}
            <div className="rounded-xl overflow-hidden p-4 space-y-3"
              style={{ background: '#1A1A1A', border: '1px solid #2A2A2A' }}>

              {/* Guest Checkout */}
              <button onClick={handleGuestCheckout} disabled={loading}
                className="w-full py-3 rounded-full text-sm font-bold text-white transition-all hover:opacity-85 disabled:opacity-60"
                style={{ background: '#374151' }}>
                {loading ? 'Memproses...' : 'Guest Checkout'}
              </button>

              <div className="flex items-center gap-3">
                <div className="flex-1 h-px" style={{ background: '#2A2A2A' }} />
                <span className="text-xs text-gray-600">OR</span>
                <div className="flex-1 h-px" style={{ background: '#2A2A2A' }} />
              </div>

              {/* Member Checkout */}
              <button onClick={handleMemberCheckout} disabled={loading}
                className="w-full py-3 rounded-full text-sm font-bold text-white transition-all hover:opacity-85 disabled:opacity-60"
                style={{ background: '#22c55e' }}>
                {loading ? 'Memproses...' : 'Member Checkout'}
              </button>

              {/* Coupon */}
              {!showCoupon ? (
                <p className="text-center text-xs text-gray-600">
                  Have a coupon?{' '}
                  <button onClick={() => setShowCoupon(true)} className="font-semibold hover:underline"
                    style={{ color: '#D4AF37' }}>
                    Click here
                  </button>
                  {' '}
                  <button className="hover:underline" style={{ color: '#e53e3e' }}>
                    Check promo.
                  </button>
                </p>
              ) : (
                <div className="flex gap-2">
                  <input type="text" value={coupon} onChange={e => setCoupon(e.target.value)}
                    placeholder="Kode kupon..."
                    className="input-field text-sm flex-1" />
                  <button onClick={() => { toast.success('Kupon diterapkan!'); setShowCoupon(false) }}
                    className="px-3 py-2 rounded-lg text-xs font-bold text-black shrink-0"
                    style={{ background: '#D4AF37' }}>
                    OK
                  </button>
                </div>
              )}
            </div>

            {/* Login prompt if not logged in */}
            {!user && (
              <div className="p-4 rounded-xl text-center" style={{ background: '#111', border: '1px solid #2A2A2A' }}>
                <p className="text-xs text-gray-500 mb-2">Login untuk Member Checkout</p>
                <div className="flex gap-2">
                  <Link to="/login" className="flex-1 py-2 rounded-lg text-xs font-bold text-center"
                    style={{ background: '#1A1A1A', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.3)' }}>
                    Login
                  </Link>
                  <Link to="/register" className="flex-1 py-2 rounded-lg text-xs font-bold text-center text-black"
                    style={{ background: 'linear-gradient(135deg,#D4AF37,#F0D060)' }}>
                    Daftar
                  </Link>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}
