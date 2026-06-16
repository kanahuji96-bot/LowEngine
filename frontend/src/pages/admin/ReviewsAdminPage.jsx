import { useState, useEffect } from 'react'
import { Trash2, Star } from 'lucide-react'
import reviewService from '../../services/reviewService'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import { PageLoader } from '../../components/ui/LoadingSpinner'
import { formatDate } from '../../utils/format'
import toast from 'react-hot-toast'

const ReviewsAdminPage = () => {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [confirm, setConfirm] = useState({ open: false, id: null })
  const [submitting, setSubmitting] = useState(false)

  const fetchReviews = () => {
    reviewService.getAll()
      .then((r) => setReviews(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchReviews() }, [])

  const handleDelete = async () => {
    setSubmitting(true)
    try {
      await reviewService.remove(confirm.id)
      toast.success('Review dihapus')
      setConfirm({ open: false, id: null })
      fetchReviews()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal hapus')
    }
    setSubmitting(false)
  }

  if (loading) return <PageLoader />

  return (
    <div>
      <div className="mb-8">
        <p className="text-primary text-sm font-semibold mb-1">Manajemen</p>
        <h1 className="text-3xl font-bold text-white">Kelola Review</h1>
      </div>

      <div className="card overflow-hidden p-0">
        <table className="w-full">
          <thead>
            <tr className="table-header">
              <th className="px-4 py-3 text-left">User</th>
              <th className="px-4 py-3 text-left">Produk</th>
              <th className="px-4 py-3 text-left">Rating</th>
              <th className="px-4 py-3 text-left">Komentar</th>
              <th className="px-4 py-3 text-left">Tanggal</th>
              <th className="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {reviews.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-10 text-gray-500">Belum ada review</td></tr>
            ) : reviews.map((r) => (
              <tr key={r.id} className="table-row">
                <td className="px-4 py-3 text-sm text-white">{r.User?.name || '-'}</td>
                <td className="px-4 py-3 text-sm text-gray-400">{r.Product?.name || '-'}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map((s) => (
                      <Star key={s} size={12} className={s <= r.rating ? 'text-primary fill-primary' : 'text-gray-600'} />
                    ))}
                    <span className="text-xs text-gray-400 ml-1">{r.rating}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-400 max-w-xs truncate">{r.comment || '-'}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{formatDate(r.created_at)}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => setConfirm({ open: true, id: r.id })}
                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-dark-400 rounded-lg transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        isOpen={confirm.open}
        onClose={() => setConfirm({ open: false, id: null })}
        onConfirm={handleDelete}
        title="Hapus Review"
        message="Yakin ingin menghapus review ini?"
        loading={submitting}
      />
    </div>
  )
}

export default ReviewsAdminPage
