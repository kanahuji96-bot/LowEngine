import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, Image } from 'lucide-react'
import api from '../../utils/api'
import Modal from '../../components/ui/Modal'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import EmptyState from '../../components/ui/EmptyState'
import StatusBadge from '../../components/ui/StatusBadge'
import { PageLoader } from '../../components/ui/LoadingSpinner'
import { formatDate } from '../../utils/format'
import toast from 'react-hot-toast'

const defaultForm = {
  title: '', description: '', content: '', tags: '',
  date: new Date().toISOString().split('T')[0],
  status: 'active', image: null,
}

export default function ServicesAdminPage() {
  const [services,   setServices]   = useState([])
  const [loading,    setLoading]    = useState(true)
  const [modal,      setModal]      = useState({ open: false, edit: null })
  const [confirm,    setConfirm]    = useState({ open: false, id: null })
  const [form,       setForm]       = useState(defaultForm)
  const [submitting, setSubmitting] = useState(false)

  const fetchServices = () => {
    setLoading(true)
    api.get('/services').then(r => setServices(r.data.data)).catch(() => {}).finally(() => setLoading(false))
  }

  useEffect(() => { fetchServices() }, [])

  const openCreate = () => { setForm(defaultForm); setModal({ open: true, edit: null }) }
  const openEdit   = (s) => {
    setForm({
      title: s.title, description: s.description || '',
      content: s.content || '', tags: s.tags || '',
      date: s.date || new Date().toISOString().split('T')[0],
      status: s.status, image: null,
    })
    setModal({ open: true, edit: s })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => { if (v !== null && v !== '') fd.append(k, v) })
      if (modal.edit) {
        await api.put(`/services/${modal.edit.id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
        toast.success('Service diperbarui')
      } else {
        await api.post('/services', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
        toast.success('Service dibuat')
      }
      setModal({ open: false, edit: null })
      fetchServices()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal')
    }
    setSubmitting(false)
  }

  const handleDelete = async () => {
    setSubmitting(true)
    try {
      await api.delete(`/services/${confirm.id}`)
      toast.success('Service dihapus')
      setConfirm({ open: false, id: null })
      fetchServices()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal hapus')
    }
    setSubmitting(false)
  }

  if (loading) return <PageLoader />

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-primary text-sm font-semibold mb-1">Halaman Services</p>
          <h1 className="text-3xl font-bold text-white">Kelola Services</h1>
          <p className="text-sm text-gray-500 mt-1">
            Artikel/service yang tampil di halaman <span className="text-primary">Offers → Services</span>
          </p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Tambah Service
        </button>
      </div>

      {/* Table */}
      {services.length === 0 ? (
        <EmptyState
          title="Belum ada service"
          description="Tambah service untuk ditampilkan di halaman Services"
          action={<button onClick={openCreate} className="btn-primary">Tambah Service</button>}
        />
      ) : (
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="table-header">
                  <th className="px-4 py-3 text-left">Service</th>
                  <th className="px-4 py-3 text-left">Tags</th>
                  <th className="px-4 py-3 text-left">Tanggal</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Gambar</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {services.map(s => {
                  const imgUrl = s.image ? `/uploads/services/${s.image}` : null
                  return (
                    <tr key={s.id} className="table-row">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0"
                            style={{ background: '#111', border: '1px solid #2A2A2A' }}>
                            {imgUrl
                              ? <img src={imgUrl} alt={s.title} className="w-full h-full object-cover" />
                              : <div className="w-full h-full flex items-center justify-center">
                                  <Image size={16} className="text-gray-600" />
                                </div>
                            }
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white line-clamp-1">{s.title}</p>
                            <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{s.description || '-'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {s.tags ? s.tags.split(',').map(t => (
                            <span key={t} className="text-[10px] px-1.5 py-0.5 rounded"
                              style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.2)' }}>
                              {t.trim()}
                            </span>
                          )) : <span className="text-xs text-gray-600">-</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-400">{s.date || '-'}</td>
                      <td className="px-4 py-3"><StatusBadge status={s.status} /></td>
                      <td className="px-4 py-3">
                        {imgUrl
                          ? <span className="text-xs text-green-400 font-semibold">✓ Ada</span>
                          : <span className="text-xs text-red-400 font-semibold">✗ Belum</span>
                        }
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => openEdit(s)}
                            className="p-2 text-gray-400 hover:text-primary hover:bg-dark-400 rounded-lg transition-colors">
                            <Pencil size={14} />
                          </button>
                          <button onClick={() => setConfirm({ open: true, id: s.id })}
                            className="p-2 text-gray-400 hover:text-red-400 hover:bg-dark-400 rounded-lg transition-colors">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Tambah/Edit */}
      <Modal
        isOpen={modal.open}
        onClose={() => setModal({ open: false, edit: null })}
        title={modal.edit ? 'Edit Service' : 'Tambah Service'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Judul Service *</label>
            <input type="text" className="input-field" value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              placeholder="Judul service..." required />
          </div>

          <div>
            <label className="label">Deskripsi Singkat</label>
            <textarea className="input-field resize-none" rows={2} value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="Deskripsi singkat yang tampil di card..." />
          </div>

          <div>
            <label className="label">Konten Lengkap</label>
            <textarea className="input-field resize-none" rows={4} value={form.content}
              onChange={e => setForm({ ...form, content: e.target.value })}
              placeholder="Isi konten lengkap service..." />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">
                Tags
                <span className="text-xs text-gray-500 ml-1 font-normal">(pisah dengan koma)</span>
              </label>
              <input type="text" className="input-field" value={form.tags}
                onChange={e => setForm({ ...form, tags: e.target.value })}
                placeholder="website, toko, admin" />
            </div>
            <div>
              <label className="label">Tanggal</label>
              <input type="date" className="input-field" value={form.date}
                onChange={e => setForm({ ...form, date: e.target.value })} />
            </div>
          </div>

          <div>
            <label className="label">Status</label>
            <select className="input-field" value={form.status}
              onChange={e => setForm({ ...form, status: e.target.value })}>
              <option value="active">Aktif — tampil di halaman Services</option>
              <option value="inactive">Nonaktif — disembunyikan</option>
            </select>
          </div>

          <div>
            <label className="label">
              🖼 Gambar Thumbnail
              <span className="text-xs text-gray-500 ml-2 font-normal">(jpg/png, max 2MB)</span>
            </label>
            <input type="file" accept=".jpg,.jpeg,.png" className="input-field"
              onChange={e => setForm({ ...form, image: e.target.files[0] })} />
            {modal.edit?.image && !form.image && (
              <div className="mt-2 flex items-center gap-2">
                <img src={`/uploads/services/${modal.edit.image}`} alt="current"
                  className="w-16 h-16 rounded-lg object-cover" style={{ border: '1px solid #333' }} />
                <span className="text-xs text-gray-500">Gambar saat ini (pilih file baru untuk mengganti)</span>
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModal({ open: false, edit: null })}
              className="flex-1 btn-outline">Batal</button>
            <button type="submit" disabled={submitting} className="flex-1 btn-primary">
              {submitting ? 'Menyimpan...' : modal.edit ? 'Simpan Perubahan' : 'Buat Service'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={confirm.open}
        onClose={() => setConfirm({ open: false, id: null })}
        onConfirm={handleDelete}
        title="Hapus Service"
        message="Yakin ingin menghapus service ini? Gambar akan ikut terhapus."
        loading={submitting}
      />
    </div>
  )
}
