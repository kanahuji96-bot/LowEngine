import { useState, useEffect } from 'react'
import paymentService from '../../services/paymentService'
import StatusBadge from '../../components/ui/StatusBadge'
import Modal from '../../components/ui/Modal'
import { PageLoader } from '../../components/ui/LoadingSpinner'
import { formatRupiah, formatDate, getStatusLabel } from '../../utils/format'
import toast from 'react-hot-toast'

const PaymentsAdminPage = () => {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [verifyForm, setVerifyForm] = useState({ status: 'verified', notes: '' })
  const [submitting, setSubmitting] = useState(false)

  const fetchPayments = () => {
    paymentService.getAll()
      .then((r) => setPayments(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchPayments() }, [])

  const handleVerify = async () => {
    setSubmitting(true)
    try {
      await paymentService.verify(selected.id, verifyForm)
      toast.success(`Payment ${verifyForm.status}`)
      setSelected(null)
      fetchPayments()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal')
    }
    setSubmitting(false)
  }

  if (loading) return <PageLoader />

  return (
    <div>
      <div className="mb-8">
        <p className="text-primary text-sm font-semibold mb-1">Manajemen</p>
        <h1 className="text-3xl font-bold text-white">Kelola Pembayaran</h1>
      </div>

      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="table-header">
                <th className="px-4 py-3 text-left">Order</th>
                <th className="px-4 py-3 text-left">User</th>
                <th className="px-4 py-3 text-left">Metode</th>
                <th className="px-4 py-3 text-left">Nominal</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Bukti</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {payments.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-10 text-gray-500">Tidak ada data pembayaran</td></tr>
              ) : payments.map((p) => (
                <tr key={p.id} className="table-row">
                  <td className="px-4 py-3 text-sm font-medium text-white">#{p.order_id}</td>
                  <td className="px-4 py-3 text-sm text-gray-300">{p.Order?.User?.name || '-'}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{getStatusLabel(p.payment_method)}</td>
                  <td className="px-4 py-3 text-sm text-primary font-semibold">{formatRupiah(p.amount)}</td>
                  <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                  <td className="px-4 py-3">
                    {p.payment_proof ? (
                      <a
                        href={`/uploads/payments/${p.payment_proof}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-primary hover:underline"
                      >
                        Lihat Bukti
                      </a>
                    ) : <span className="text-xs text-gray-500">-</span>}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {p.status === 'pending' && (
                      <button
                        onClick={() => { setSelected(p); setVerifyForm({ status: 'verified', notes: '' }) }}
                        className="text-xs text-primary hover:text-primary-light border border-primary/30 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Verifikasi
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Verify Modal */}
      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title={`Verifikasi Payment #${selected?.id}`}>
        <div className="space-y-4">
          <div>
            <label className="label">Keputusan</label>
            <select className="input-field" value={verifyForm.status} onChange={(e) => setVerifyForm({ ...verifyForm, status: e.target.value })}>
              <option value="verified">Verifikasi (Setujui)</option>
              <option value="rejected">Reject (Tolak)</option>
            </select>
          </div>
          <div>
            <label className="label">Catatan Admin (opsional)</label>
            <textarea className="input-field resize-none" rows={3} value={verifyForm.notes} onChange={(e) => setVerifyForm({ ...verifyForm, notes: e.target.value })} placeholder="Catatan untuk user..." />
          </div>
          <div className="flex gap-3">
            <button onClick={() => setSelected(null)} className="flex-1 btn-outline">Batal</button>
            <button onClick={handleVerify} disabled={submitting} className="flex-1 btn-primary">
              {submitting ? 'Memproses...' : 'Konfirmasi'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default PaymentsAdminPage
