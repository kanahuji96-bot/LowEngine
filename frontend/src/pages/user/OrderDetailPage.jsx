import { useState, useEffect } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { ArrowLeft, Upload } from 'lucide-react'
import orderService from '../../services/orderService'
import paymentService from '../../services/paymentService'
import reviewService from '../../services/reviewService'
import { useAuth } from '../../hooks/useAuth'
import { formatRupiah, formatDate, getStatusLabel } from '../../utils/format'
import StatusBadge from '../../components/ui/StatusBadge'
import { PageLoader } from '../../components/ui/LoadingSpinner'
import Modal from '../../components/ui/Modal'
import toast from 'react-hot-toast'

const OrderDetailPage = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [paymentModal, setPaymentModal] = useState(false)
  const [reviewModal, setReviewModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [paymentForm, setPaymentForm] = useState({ payment_method: 'transfer', amount: '', file: null })
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' })
  const [submitting, setSubmitting] = useState(false)

  if (!user) return <Navigate to="/login" replace />

  const fetchOrder = () => {
    orderService.getDetail(id)
      .then((r) => setOrder(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchOrder() }, [id])

  const handlePaymentSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const fd = new FormData()
      fd.append('payment_method', paymentForm.payment_method)
      fd.append('amount', paymentForm.amount)
      if (paymentForm.file) fd.append('payment_proof', paymentForm.file)
      await paymentService.upload(order.id, fd)
      toast.success('Bukti pembayaran berhasil diupload')
      setPaymentModal(false)
      fetchOrder()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal upload')
    }
    setSubmitting(false)
  }

  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await reviewService.create({ product_id: selectedProduct, order_id: order.id, ...reviewForm })
      toast.success('Review berhasil dikirim')
      setReviewModal(false)
      fetchOrder()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal review')
    }
    setSubmitting(false)
  }

  if (loading) return <PageLoader />
  if (!order) return (
    <div className="max-w-4xl mx-auto px-4 py-20 text-center">
      <p className="text-gray-400">Order tidak ditemukan</p>
      <Link to="/orders" className="btn-primary mt-4 inline-flex">Kembali</Link>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link to="/orders" className="flex items-center gap-1 text-sm text-gray-500 hover:text-white mb-8 transition-colors">
        <ArrowLeft size={14} /> Kembali ke Pesanan
      </Link>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Order #{order.id}</h1>
          <p className="text-sm text-gray-500">{formatDate(order.created_at)}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="space-y-6">
        {/* Items */}
        <div className="card">
          <h2 className="text-lg font-semibold text-white mb-4">Produk</h2>
          <div className="space-y-3">
            {order.items?.map((item) => {
              const imageUrl = item.Product?.image ? `/uploads/products/${item.Product.image}` : null
              return (
                <div key={item.id} className="flex items-center gap-4 py-2 border-b border-dark-400 last:border-0">
                  <div className="w-12 h-12 bg-dark-300 rounded-lg overflow-hidden flex-shrink-0">
                    {imageUrl ? <img src={imageUrl} alt={item.Product?.name} className="w-full h-full object-cover" /> : <span className="text-xl flex items-center justify-center h-full">📦</span>}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{item.Product?.name}</p>
                    <p className="text-xs text-gray-500">{item.quantity} × {formatRupiah(item.price)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-primary">{formatRupiah(item.subtotal)}</span>
                    {order.status === 'completed' && (
                      <button
                        onClick={() => { setSelectedProduct(item.product_id); setReviewModal(true) }}
                        className="text-xs text-primary hover:text-primary-light border border-primary/30 px-2 py-1 rounded-lg transition-colors"
                      >
                        Review
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
          <div className="flex justify-between pt-4 mt-2">
            <span className="font-semibold text-white">Total</span>
            <span className="font-bold text-primary text-lg">{formatRupiah(order.total_amount)}</span>
          </div>
        </div>

        {/* Shipping */}
        <div className="card">
          <h2 className="text-lg font-semibold text-white mb-3">Info Pengiriman</h2>
          <p className="text-sm text-gray-400">{order.shipping_address}</p>
          {order.notes && <p className="text-sm text-gray-500 mt-2">Catatan: {order.notes}</p>}
        </div>

        {/* Payment */}
        {order.Payment ? (
          <div className="card">
            <h2 className="text-lg font-semibold text-white mb-3">Pembayaran</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Metode: {getStatusLabel(order.Payment.payment_method)}</p>
                <p className="text-sm text-gray-400">Nominal: {formatRupiah(order.Payment.amount)}</p>
              </div>
              <StatusBadge status={order.Payment.status} />
            </div>
            {order.Payment.notes && <p className="text-xs text-gray-500 mt-2">Catatan admin: {order.Payment.notes}</p>}
          </div>
        ) : order.status === 'waiting_payment' ? (
          <div className="card">
            <h2 className="text-lg font-semibold text-white mb-3">Upload Pembayaran</h2>
            <p className="text-sm text-gray-400 mb-4">Selesaikan pembayaran untuk melanjutkan pesanan.</p>
            <button onClick={() => setPaymentModal(true)} className="btn-primary flex items-center gap-2">
              <Upload size={16} /> Upload Bukti Bayar
            </button>
          </div>
        ) : null}
      </div>

      {/* Payment Modal */}
      <Modal isOpen={paymentModal} onClose={() => setPaymentModal(false)} title="Upload Bukti Pembayaran">
        <form onSubmit={handlePaymentSubmit} className="space-y-4">
          <div>
            <label className="label">Metode Pembayaran</label>
            <select
              className="input-field"
              value={paymentForm.payment_method}
              onChange={(e) => setPaymentForm({ ...paymentForm, payment_method: e.target.value })}
            >
              <option value="transfer">Transfer Bank</option>
              <option value="ewallet">E-Wallet</option>
              <option value="cash">Cash</option>
            </select>
          </div>
          <div>
            <label className="label">Nominal Pembayaran</label>
            <input
              type="number"
              className="input-field"
              placeholder={order.total_amount}
              value={paymentForm.amount}
              onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="label">Bukti Pembayaran (jpg/png/pdf)</label>
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              className="input-field"
              onChange={(e) => setPaymentForm({ ...paymentForm, file: e.target.files[0] })}
            />
          </div>
          <button type="submit" disabled={submitting} className="w-full btn-primary">
            {submitting ? 'Mengirim...' : 'Upload Bukti Bayar'}
          </button>
        </form>
      </Modal>

      {/* Review Modal */}
      <Modal isOpen={reviewModal} onClose={() => setReviewModal(false)} title="Tulis Review">
        <form onSubmit={handleReviewSubmit} className="space-y-4">
          <div>
            <label className="label">Rating</label>
            <div className="flex gap-2">
              {[1,2,3,4,5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setReviewForm({ ...reviewForm, rating: s })}
                  className={`w-10 h-10 rounded-lg font-bold text-sm transition-colors ${s <= reviewForm.rating ? 'bg-primary text-black' : 'bg-dark-300 text-gray-400 border border-dark-500'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="label">Komentar</label>
            <textarea
              className="input-field resize-none"
              rows={3}
              placeholder="Bagikan pengalamanmu..."
              value={reviewForm.comment}
              onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
            />
          </div>
          <button type="submit" disabled={submitting} className="w-full btn-primary">
            {submitting ? 'Mengirim...' : 'Kirim Review'}
          </button>
        </form>
      </Modal>
    </div>
  )
}

export default OrderDetailPage
