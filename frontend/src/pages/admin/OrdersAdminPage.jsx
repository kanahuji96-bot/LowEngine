import { useState, useEffect } from 'react'
import orderService from '../../services/orderService'
import StatusBadge from '../../components/ui/StatusBadge'
import Modal from '../../components/ui/Modal'
import { PageLoader } from '../../components/ui/LoadingSpinner'
import { formatRupiah, formatDate } from '../../utils/format'
import toast from 'react-hot-toast'

const ORDER_STATUSES = ['pending', 'waiting_payment', 'paid', 'processed', 'shipped', 'completed', 'cancelled']

const OrdersAdminPage = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [updatingStatus, setUpdatingStatus] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const fetchOrders = () => {
    const params = {}
    if (filterStatus) params.status = filterStatus
    orderService.getAll(params)
      .then((r) => setOrders(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchOrders() }, [filterStatus])

  const handleUpdateStatus = async () => {
    if (!updatingStatus) return
    setSubmitting(true)
    try {
      await orderService.updateStatus(selectedOrder.id, updatingStatus)
      toast.success('Status order diperbarui')
      setSelectedOrder(null)
      fetchOrders()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal')
    }
    setSubmitting(false)
  }

  if (loading) return <PageLoader />

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-primary text-sm font-semibold mb-1">Manajemen</p>
          <h1 className="text-3xl font-bold text-white">Kelola Order</h1>
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="input-field w-auto"
        >
          <option value="">Semua Status</option>
          {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="table-header">
                <th className="px-4 py-3 text-left">Order ID</th>
                <th className="px-4 py-3 text-left">User</th>
                <th className="px-4 py-3 text-left">Total</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Tanggal</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-10 text-gray-500">Tidak ada order</td></tr>
              ) : orders.map((o) => (
                <tr key={o.id} className="table-row">
                  <td className="px-4 py-3 text-sm font-medium text-white">#{o.id}</td>
                  <td className="px-4 py-3 text-sm text-gray-300">{o.User?.name || '-'}</td>
                  <td className="px-4 py-3 text-sm text-primary font-semibold">{formatRupiah(o.total_amount)}</td>
                  <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
                  <td className="px-4 py-3 text-sm text-gray-500">{formatDate(o.created_at)}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => { setSelectedOrder(o); setUpdatingStatus(o.status) }}
                      className="text-xs text-primary hover:text-primary-light border border-primary/30 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Update Status
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Update Status Modal */}
      <Modal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={`Update Status — Order #${selectedOrder?.id}`}
      >
        <div className="space-y-4">
          <div>
            <label className="label">Status Baru</label>
            <select
              className="input-field"
              value={updatingStatus}
              onChange={(e) => setUpdatingStatus(e.target.value)}
            >
              {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setSelectedOrder(null)} className="flex-1 btn-outline">Batal</button>
            <button onClick={handleUpdateStatus} disabled={submitting} className="flex-1 btn-primary">
              {submitting ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default OrdersAdminPage
