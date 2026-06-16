import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../hooks/useCart'
import { useAuth } from '../../hooks/useAuth'
import { formatRupiah } from '../../utils/format'
import orderService from '../../services/orderService'
import toast from 'react-hot-toast'

const CheckoutPage = () => {
  const { cart, totalPrice, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ shipping_address: '', notes: '' })

  if (cart.length === 0) {
    navigate('/cart')
    return null
  }

  const handleOrder = async (e) => {
    e.preventDefault()
    if (!form.shipping_address) {
      toast.error('Alamat pengiriman wajib diisi')
      return
    }
    setLoading(true)
    try {
      const items = cart.map((item) => ({ product_id: item.id, quantity: item.quantity }))
      const res = await orderService.create({ items, shipping_address: form.shipping_address, notes: form.notes })
      clearCart()
      toast.success('Order berhasil dibuat!')
      navigate(`/orders/${res.data.data.id}`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Order gagal')
    }
    setLoading(false)
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-white mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleOrder} className="space-y-5">
            <div className="card">
              <h2 className="text-lg font-semibold text-white mb-4">Informasi Pengiriman</h2>
              <div className="space-y-4">
                <div>
                  <label className="label">Nama Penerima</label>
                  <input type="text" className="input-field" value={user?.name} readOnly />
                </div>
                <div>
                  <label className="label">Alamat Lengkap</label>
                  <textarea
                    className="input-field min-h-[100px] resize-none"
                    placeholder="Jl. contoh No. 1, Kota, Provinsi"
                    value={form.shipping_address}
                    onChange={(e) => setForm({ ...form, shipping_address: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="label">Catatan (opsional)</label>
                  <textarea
                    className="input-field resize-none"
                    placeholder="Catatan untuk penjual..."
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Item list */}
            <div className="card">
              <h2 className="text-lg font-semibold text-white mb-4">Produk yang Dipesan</h2>
              <div className="space-y-3">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">{item.name} × {item.quantity}</span>
                    <span className="text-white font-medium">{formatRupiah(item.price * item.quantity)}</span>
                  </div>
                ))}
                <div className="border-t border-dark-400 pt-3 flex justify-between">
                  <span className="font-semibold text-white">Total</span>
                  <span className="font-bold text-primary">{formatRupiah(totalPrice)}</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 text-base"
            >
              {loading ? 'Memproses...' : 'Buat Pesanan'}
            </button>
          </form>
        </div>

        {/* Info */}
        <div className="lg:col-span-1">
          <div className="card">
            <h2 className="text-lg font-semibold text-white mb-4">Cara Bayar</h2>
            <ol className="text-sm text-gray-400 space-y-2 list-decimal list-inside">
              <li>Buat pesanan di halaman ini</li>
              <li>Pergi ke halaman detail pesanan</li>
              <li>Upload bukti pembayaran</li>
              <li>Tunggu konfirmasi admin</li>
            </ol>
            <div className="mt-4 p-3 bg-primary/10 border border-primary/20 rounded-lg">
              <p className="text-xs text-primary">Total: <strong>{formatRupiah(totalPrice)}</strong></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage
