import { useState, useEffect } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { formatRupiah } from '../../utils/format'
import { useAuth } from '../../hooks/useAuth'
import orderService from '../../services/orderService'
import api from '../../utils/api'
import toast from 'react-hot-toast'

export default function PaymentConfirmPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()

  const { product, payMethod = 'Transfer Bank', total = 0, subtotal = 0, fee = 15000, address = '' } = location.state || {}

  const [loading,    setLoading]    = useState(false)
  const [confirmed,  setConfirmed]  = useState(false)
  const [settings,   setSettings]   = useState([])
  const [activeSetting, setActiveSetting] = useState(null)

  useEffect(() => {
    api.get('/payment-settings/active')
      .then(r => {
        const data = r.data.data
        setSettings(data)
        // cari setting yang cocok dengan metode yang dipilih
        const match = data.find(s => s.label === payMethod || s.method === payMethod.toLowerCase().replace(' ', ''))
        setActiveSetting(match || data[0] || null)
      })
      .catch(() => {})
  }, [payMethod])

  const totalDue = total || (Number(product?.price || 0) + fee)

  const handleConfirm = async () => {
    if (!user) { navigate('/login'); return }
    setLoading(true)
    try {
      if (product) {
        const res = await orderService.create({
          items: [{ product_id: product.id, quantity: 1 }],
          shipping_address: address || `Pembelian: ${product.name}`,
          notes: `Metode: ${payMethod} | Menunggu konfirmasi pembayaran`,
        })
        setConfirmed(true)
        toast.success('Order dibuat! Silakan upload bukti pembayaran.')
        setTimeout(() => navigate(`/orders/${res.data.data.id}`), 1500)
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal membuat order')
    }
    setLoading(false)
  }

  if (!product && !location.state) {
    return (
      <div style={{ background: '#0A0A0A', minHeight: '100vh' }} className="flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Tidak ada data pembayaran</p>
          <Link to="/products" className="btn-primary">Kembali</Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: '#0A0A0A', minHeight: '100vh' }}>
      <div className="max-w-2xl mx-auto px-4 py-10">

        {/* Payment Created Header */}
        <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #2A2A2A' }}>
          <div className="px-5 py-3 text-center"
            style={{ background: 'linear-gradient(135deg,#8B0000,#cc0000)' }}>
            <h1 className="text-base font-black text-white">Payment created</h1>
          </div>

          <div style={{ background: '#1A1A1A' }}>
            {product && (
              <div className="flex items-center justify-between px-5 py-3"
                style={{ borderBottom: '1px solid #2A2A2A' }}>
                <span className="text-sm text-gray-400 line-clamp-1 flex-1 mr-4">{product.name}</span>
                <span className="text-sm font-semibold text-white shrink-0">{formatRupiah(product.price || 0)}</span>
              </div>
            )}
            <div className="flex items-center justify-between px-5 py-3"
              style={{ borderBottom: '1px solid #2A2A2A' }}>
              <span className="text-sm text-gray-400">Handling Fee</span>
              <span className="text-sm font-semibold text-white">{formatRupiah(fee)}</span>
            </div>
            <div className="flex items-center justify-between px-5 py-4"
              style={{ background: 'rgba(212,175,55,0.05)' }}>
              <span className="text-sm font-bold text-white">Total Due</span>
              <span className="text-base font-black" style={{ color: '#D4AF37' }}>{formatRupiah(totalDue)}</span>
            </div>
          </div>

          <div className="px-5 py-3 text-center text-xs"
            style={{ background: '#111', borderTop: '1px solid #2A2A2A' }}>
            <span className="text-gray-400">Funds will be </span>
            <span className="font-bold" style={{ color: '#e53e3e' }}>Returned</span>
            <span className="text-gray-400"> if the transfer amount does not match the </span>
            <span className="font-bold" style={{ color: '#D4AF37' }}>Total Payment</span>
          </div>
        </div>

        {/* Complete button */}
        <button onClick={handleConfirm} disabled={loading || confirmed}
          className="w-full py-3.5 text-sm font-black text-white uppercase tracking-widest transition-all hover:opacity-85 mt-0 disabled:opacity-60"
          style={{ background: confirmed ? '#22c55e' : 'linear-gradient(135deg,#8B0000,#cc0000)', borderRadius: '0 0 12px 12px' }}>
          {confirmed ? '✓ Payment Confirmed!' : loading ? 'Memproses...' : 'Complete payment and confirm'}
        </button>

        {/* Payment Method */}
        <div className="mt-8 rounded-xl overflow-hidden" style={{ background: '#1A1A1A', border: '1px solid #2A2A2A' }}>
          <div className="p-5">
            <h2 className="text-base font-black text-white mb-4 uppercase tracking-widest">Payment Method</h2>

            {activeSetting ? (
              <ul className="space-y-2 mb-5 text-sm text-gray-400">
                {activeSetting.account_no && (
                  <li>• Norek Admin: <span className="text-white font-semibold">{activeSetting.account_no}</span></li>
                )}
                <li className="flex items-center gap-2 flex-wrap">
                  <span>• A/N:</span>
                  {activeSetting.account_name ? (
                    <span className="text-white font-semibold">{activeSetting.account_name}</span>
                  ) : (
                    <span className="flex items-center gap-2 flex-wrap">
                      <span className="text-white font-semibold">Hubungi Admin via:</span>
                      {activeSetting.whatsapp && (
                        <a href={`https://wa.me/${activeSetting.whatsapp}`} target="_blank" rel="noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-white text-xs transition-all hover:opacity-85 hover:scale-105"
                          style={{ background: '#25d366' }}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" fill="white"/>
                            <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.978-1.404A9.953 9.953 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a7.95 7.95 0 01-4.071-1.115l-.29-.174-3.007.847.854-2.927-.19-.301A7.96 7.96 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" fill="white"/>
                          </svg>
                          WhatsApp
                        </a>
                      )}
                      {activeSetting.telegram && (
                        <a href={`https://t.me/${activeSetting.telegram}`} target="_blank" rel="noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-white text-xs transition-all hover:opacity-85 hover:scale-105"
                          style={{ background: '#0088cc' }}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8l-1.7 8.02c-.12.58-.46.72-.93.45l-2.57-1.89-1.24 1.19c-.14.14-.25.25-.51.25l.18-2.6 4.7-4.25c.2-.18-.05-.28-.32-.1L7.9 14.47l-2.52-.79c-.55-.17-.56-.55.12-.82l9.86-3.8c.45-.17.85.1.28.74z" fill="white"/>
                          </svg>
                          Telegram
                        </a>
                      )}
                    </span>
                  )}
                </li>
                <li>• Ewallet: <span className="text-white font-semibold">{activeSetting.label}</span></li>
                {activeSetting.qr_image && <li>• QR Code:</li>}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 mb-4">Hubungi admin untuk info pembayaran.</p>
            )}

            {/* QR Code dari admin */}
            {activeSetting?.qr_image && (
              <div className="flex justify-center mb-4">
                <div className="rounded-xl overflow-hidden p-3" style={{ background: '#fff', display: 'inline-block' }}>
                  <img src={`/uploads/qris/${activeSetting.qr_image}`} alt="QR Code"
                    className="rounded-lg" style={{ width: 160, height: 160, objectFit: 'contain' }} />
                </div>
              </div>
            )}

            {activeSetting && (
              <p className="text-xs text-center text-gray-500">
                Transfer tepat sesuai nominal total. Funds akan dikembalikan jika nominal tidak sesuai.
              </p>
            )}
          </div>
        </div>

        {/* Payment Confirmation */}
        <div className="mt-4 rounded-xl overflow-hidden" style={{ background: '#1A1A1A', border: '1px solid #2A2A2A' }}>
          <div className="p-5">
            <h2 className="text-base font-black text-white mb-3 uppercase tracking-widest">Payment Confirmation</h2>
            <p className="text-sm text-gray-400 mb-3">
              Send your email and proof of transfer to the Telegram or Email address below.
            </p>
            <ul className="space-y-1.5 text-sm">
              {activeSetting?.telegram && (
                <li>
                  <span className="text-gray-500">• Telegram: </span>
                  <a href={`https://t.me/${activeSetting.telegram}`} target="_blank" rel="noreferrer"
                    className="font-semibold hover:underline" style={{ color: '#D4AF37' }}>
                    @{activeSetting.telegram}
                  </a>
                </li>
              )}
              {activeSetting?.email && (
                <li>
                  <span className="text-gray-500">• Email: </span>
                  <a href={`mailto:${activeSetting.email}`}
                    className="font-semibold hover:underline" style={{ color: '#D4AF37' }}>
                    {activeSetting.email}
                  </a>
                </li>
              )}
              {!activeSetting?.telegram && !activeSetting?.email && (
                <li className="text-gray-500 text-xs">Hubungi admin untuk konfirmasi pembayaran.</li>
              )}
            </ul>
          </div>
        </div>

        {/* Cancel + Confirm */}
        <div className="flex items-center justify-center gap-4 mt-6">
          <button onClick={() => navigate(-1)}
            className="px-8 py-2.5 rounded-full text-sm font-bold transition-all hover:opacity-85"
            style={{ background: '#374151', color: '#fff' }}>
            Cancel
          </button>
          <button onClick={handleConfirm} disabled={loading || confirmed}
            className="px-8 py-2.5 rounded-full text-sm font-bold transition-all hover:opacity-85 disabled:opacity-60"
            style={{ background: '#22c55e', color: '#fff' }}>
            {confirmed ? 'Confirmed!' : loading ? 'Processing...' : 'Confirm'}
          </button>
        </div>

      </div>
    </div>
  )
}
