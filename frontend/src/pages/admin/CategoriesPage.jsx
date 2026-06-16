import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import categoryService from '../../services/categoryService'
import Modal from '../../components/ui/Modal'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import EmptyState from '../../components/ui/EmptyState'
import { PageLoader } from '../../components/ui/LoadingSpinner'
import { formatDate } from '../../utils/format'
import toast from 'react-hot-toast'

const CategoriesPage = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState({ open: false, edit: null })
  const [confirm, setConfirm] = useState({ open: false, id: null })
  const [form, setForm] = useState({ name: '', description: '' })
  const [submitting, setSubmitting] = useState(false)

  const fetchCategories = () => {
    categoryService.getAll()
      .then((r) => setCategories(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchCategories() }, [])

  const openCreate = () => {
    setForm({ name: '', description: '' })
    setModal({ open: true, edit: null })
  }

  const openEdit = (cat) => {
    setForm({ name: cat.name, description: cat.description || '' })
    setModal({ open: true, edit: cat })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      if (modal.edit) {
        await categoryService.update(modal.edit.id, form)
        toast.success('Kategori diperbarui')
      } else {
        await categoryService.create(form)
        toast.success('Kategori dibuat')
      }
      setModal({ open: false, edit: null })
      fetchCategories()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal')
    }
    setSubmitting(false)
  }

  const handleDelete = async () => {
    setSubmitting(true)
    try {
      await categoryService.remove(confirm.id)
      toast.success('Kategori dihapus')
      setConfirm({ open: false, id: null })
      fetchCategories()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal hapus')
    }
    setSubmitting(false)
  }

  if (loading) return <PageLoader />

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-primary text-sm font-semibold mb-1">Master Data</p>
          <h1 className="text-3xl font-bold text-white">Kategori</h1>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Tambah Kategori
        </button>
      </div>

      {categories.length === 0 ? (
        <EmptyState title="Belum ada kategori" action={<button onClick={openCreate} className="btn-primary">Tambah Kategori</button>} />
      ) : (
        <div className="card overflow-hidden p-0">
          <table className="w-full">
            <thead>
              <tr className="table-header">
                <th className="px-6 py-3 text-left">No</th>
                <th className="px-6 py-3 text-left">Nama</th>
                <th className="px-6 py-3 text-left">Deskripsi</th>
                <th className="px-6 py-3 text-left">Dibuat</th>
                <th className="px-6 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat, i) => (
                <tr key={cat.id} className="table-row">
                  <td className="px-6 py-4 text-sm text-gray-500">{i + 1}</td>
                  <td className="px-6 py-4 text-sm font-medium text-white">{cat.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-400 max-w-xs truncate">{cat.description || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{formatDate(cat.created_at)}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(cat)} className="p-2 text-gray-400 hover:text-primary hover:bg-dark-400 rounded-lg transition-colors">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => setConfirm({ open: true, id: cat.id })} className="p-2 text-gray-400 hover:text-red-400 hover:bg-dark-400 rounded-lg transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={modal.open}
        onClose={() => setModal({ open: false, edit: null })}
        title={modal.edit ? 'Edit Kategori' : 'Tambah Kategori'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Nama Kategori</label>
            <input
              type="text"
              className="input-field"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Nama kategori..."
              required
            />
          </div>
          <div>
            <label className="label">Deskripsi (opsional)</label>
            <textarea
              className="input-field resize-none"
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Deskripsi kategori..."
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModal({ open: false, edit: null })} className="flex-1 btn-outline">Batal</button>
            <button type="submit" disabled={submitting} className="flex-1 btn-primary">
              {submitting ? 'Menyimpan...' : modal.edit ? 'Simpan' : 'Buat'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={confirm.open}
        onClose={() => setConfirm({ open: false, id: null })}
        onConfirm={handleDelete}
        title="Hapus Kategori"
        message="Yakin ingin menghapus kategori ini?"
        loading={submitting}
      />
    </div>
  )
}

export default CategoriesPage
