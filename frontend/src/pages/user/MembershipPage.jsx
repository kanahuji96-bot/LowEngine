import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CheckCircle2, Crown } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import toast from 'react-hot-toast'

const PLANS = [
  {
    key: 'lite',
    label: 'Lite',
    price: 'Rp 1.485.000',
    priceNum: 1485000,
    fee: 'Rp 15.000',
    subtotal: 'Rp 1.485.000',
    total: 'Rp 1.500.000',
    features: [
      'Active for 360 days',
      '100 downloads per day',
      '360 total downloads',
      'Free updates for 1 year',
      'Includes new products',
      'Free products only',
      'Extended license',
    ],
  },
  {
    key: 'star',
    label: 'Star',
    price: 'Rp 2.985.000',
    priceNum: 2985000,
    fee: 'Rp 15.000',
    subtotal: 'Rp 2.985.000',
    total: 'Rp 3.000.000',
    features: [
      'Active for 720 days',
      '200 downloads per day',
      '720 total downloads',
      'Free updates for 2 years',
      'Includes new products',
      'Special products only',
      'Extended license',
    ],
  },
  {
    key: 'dev',
    label: 'Dev',
    price: 'Rp 14.850.000',
    priceNum: 14850000,
    fee: 'Rp 150.000',
    subtotal: 'Rp 14.850.000',
    total: 'Rp 15.000.000',
    features: [
      'Active for 1440 days',
      '400 downloads per day',
      '1440 total downloads',
      'Free updates for 4 years',
      'Includes new products',
      'Free for all products',
      'Extended license',
    ],
  },
]

const PAYMENT_METHODS = ['Transfer Bank', 'DANA', 'OVO', 'GoPay', 'ShopeePay', 'PayPal']

export default function MembershipPage() {
  const { user } = useAuth()
  const navigate  = useNavigate()
  const [selected, setSelected] = useState('star')
  const [payMethod, setPayMethod] = useState('Transfer Bank')
  const [coupon, setCoupon] = useState('')
  const [showCoupon, setShowCoupon] = useState(false)
  const [loading, setLoading] = useState(false)

  const plan = PLANS.find(p => p.key === selected)

  const handleSubscribe = () => {
    if (!user) { toast.error('Login dulu untuk berlangganan'); navigate('/login'); return }
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      toast.success(`Berhasil berlangganan paket ${plan.label}! Tim kami akan menghubungi kamu.`)
    }, 1500)
  }

  return (
    <div style={{ background: '#0A0A0A', minHeight: '100vh' }}>
      <div className="max-w-5xl mx-auto px-4 py-10">

        {/* Plan selector tabs */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {PLANS.map(p => (
            <button key={p.key} onClick={() => setSelected(p.key)}
              className="px-5 py-2 rounded-full text-sm font-bold transition-all"
              style={selected === p.key
                ? { background: 'linear-gradient(135deg,#D4AF37,#F0D060)', color: '#000', boxShadow: '0 0 16px rgba(212,175,55,0.4)' }
                : { background: '#1A1A1A', color: '#9ca3af', border: '1px solid #2A2A2A' }}>
              {p.label} Plan
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Left: Plan Detail ── */}
          <div className="lg:col-span-2">
            {/* Header card */}
            <div className="rounded-xl overflow-hidden mb-4"
              style={{ border: '1px solid #2A2A2A' }}>
              <div className="px-6 py-5"
                style={{ background: 'linear-gradient(135deg,#8B6914,#D4AF37)' }}>
                <div className="flex items-center gap-2 mb-1">
                  <Crown size={20} className="text-yellow-300" />
                  <h1 className="text-xl font-black text-white">Membership</h1>
                </div>
                <p className="text-sm text-red-200">{plan.label} Plan</p>
              </div>

              <div className="p-6" style={{ background: '#1A1A1A' }}>
                <div className="flex items-center justify-between mb-5 pb-4"
                  style={{ borderBottom: '1px solid #2A2A2A' }}>
                  <span className="text-lg font-black text-white">{plan.label}</span>
                  <span className="text-lg font-black text-white">{plan.price}</span>
                </div>

                <ul className="space-y-3">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-3 text-sm text-gray-300">
                      <CheckCircle2 size={16} className="text-green-400 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Other plans */}
            <p className="text-xs text-gray-600 mb-3">Paket lainnya:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PLANS.filter(p => p.key !== selected).map(p => (
                <button key={p.key} onClick={() => setSelected(p.key)}
                  className="text-left p-4 rounded-xl transition-all hover:-translate-y-0.5"
                  style={{ background: '#111', border: '1px solid #2A2A2A' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(212,175,55,0.3)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = '#2A2A2A'}>
                  <p className="text-sm font-bold text-white mb-1">{p.label}</p>
                  <p className="text-xs text-[#D4AF37] font-bold">{p.price}</p>
                  <p className="text-xs text-gray-600 mt-1">{p.features[0]}</p>
                </button>
              ))}
            </div>
          </div>

          {/* ── Right: Summary & Payment ── */}
          <div className="space-y-4">

            {/* Price summary */}
            <div className="rounded-xl overflow-hidden" style={{ background: '#1A1A1A', border: '1px solid #2A2A2A' }}>
              <div className="p-5 space-y-3">
                {[
                  { label: 'Fee', value: plan.fee },
                  { label: 'Subtotal', value: plan.subtotal },
                  { label: 'PPN', value: '0%' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between py-2"
                    style={{ borderBottom: '1px solid #2A2A2A' }}>
                    <span className="text-sm text-gray-400">{label} :</span>
                    <span className="text-sm font-semibold text-white">{value}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm font-bold text-white">Total :</span>
                  <span className="text-sm font-black text-[#D4AF37]">{plan.total}</span>
                </div>
              </div>
            </div>

            {/* Payment method */}
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

            {/* Subscribe button */}
            <button onClick={handleSubscribe} disabled={loading}
              className="w-full py-3.5 rounded-xl font-black text-black text-sm uppercase tracking-widest transition-all hover:opacity-85 hover:scale-[1.01] disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg,#D4AF37,#F0D060)', boxShadow: '0 0 20px rgba(212,175,55,0.3)' }}>
              {loading ? 'Memproses...' : user ? 'Berlangganan Sekarang' : 'Login untuk Berlangganan'}
            </button>

            {/* Coupon */}
            <div className="text-center">
              {!showCoupon ? (
                <p className="text-xs text-gray-600">
                  Punya kupon?{' '}
                  <button onClick={() => setShowCoupon(true)} className="text-[#D4AF37] hover:underline font-semibold">
                    Klik di sini
                  </button>
                </p>
              ) : (
                <div className="flex gap-2">
                  <input type="text" value={coupon} onChange={e => setCoupon(e.target.value)}
                    placeholder="Masukkan kode kupon..."
                    className="input-field text-sm flex-1" />
                  <button onClick={() => { toast.success('Kupon diterapkan!'); setShowCoupon(false) }}
                    className="px-3 py-2 rounded-lg text-xs font-bold text-black"
                    style={{ background: '#D4AF37' }}>
                    Terapkan
                  </button>
                </div>
              )}
            </div>

            {/* Login prompt */}
            {!user && (
              <div className="text-center p-4 rounded-xl" style={{ background: '#111', border: '1px solid #2A2A2A' }}>
                <p className="text-xs text-gray-500 mb-2">Belum punya akun?</p>
                <div className="flex gap-2">
                  <Link to="/login" className="flex-1 py-2 rounded-lg text-xs font-bold text-center transition-all"
                    style={{ background: '#1A1A1A', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.3)' }}>
                    Login
                  </Link>
                  <Link to="/register" className="flex-1 py-2 rounded-lg text-xs font-bold text-center text-black transition-all"
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
