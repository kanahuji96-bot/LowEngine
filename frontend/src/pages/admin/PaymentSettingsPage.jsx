import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, Image, CreditCard, ToggleLeft, ToggleRight } from 'lucide-react'
import api from '../../utils/api'
import Modal from '../../components/ui/Modal'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import EmptyState from '../../components/ui/EmptyState'
import { PageLoader } from '../../components/ui/LoadingSpinner'
import toast from 'react-hot-toast'

const METHOD_OPTIONS = [
  { value: 'transfer',  label: 'Transfer Bank' },
  { value: 'dana',      label: 'DANA' },
  { value: 'ovo',       label: 'OVO' },
  { value: 'gopay',     label: 'GoPay' },
  { value: 'shopeepay', label: 'ShopeePay' },
  { value: 'qris',      label: 'QRIS' },
  { value: 'paypal',    label: 'PayPal' },
  { value: 'crypto',    label: 'Crypto/USDT' },
  { value: 'manual',    label: 'Manual' },
]

const defaultForm = {
  method: 'transfer', label: '', account_name: '',
  account_no: '', whatsapp: '', telegram: '',
  email: '', is_active: true, sort_order: 0, qr_image: null,
}

export default function PaymentSettingsPage() {
  const [settings,   setSettings]   = useState([])
  const [loading,    setLoading]    = useState(true)
  const [modal,      setModal]      = useState({ open: false, edit: null })
  const [confirm,    setConfirm]    = useState({ open: false, id: null })
  const [form,       setForm]       = useState(defaultForm)
  const [submitting, setSubmitting] = useState(false)

  const fetch = () => {
    setLoading(true)
    api.get('/payment-settings').then(r => setSettings(r.data.data)).catch(() => {}).finally(() => setLoading(false))
  }

  useEffect(() => { fetch() }, [])

  const openCreate = () => { setForm(defaultForm); setModal({ open: true, edit: null }) }
  const openEdit   = (s) => {
    setForm({ method: s.method, label: s.label, account_name: s.account_name || '', account_no: s.account_no || '', whatsapp: s.whatsapp || '', telegram: s.telegram || '', email: s.email || '', is_active: s.is_active, sort_order: s.sort_order || 0, qr_image: null })
    setModal({ open: true, edit: s })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => { if (v !== null && v !== '') fd.append(k, v) })
      if (modal.edit) {
        await api.put(`/payment-settings/${modal.edit.id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
        toast.success('Rekening diperbarui')
      } else {
        await api.post('/payment-settings', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
        toast.success('Rekening ditambahkan')
      }
      setModal({ open: false, edit: null })
      fetch()
    } catch (err) { toast.error(err.response?.data?.message || 'Gagal') }
    setSubmitting(false)
  }

  const handleDelete = async () => {
    setSubmitting(true)
    try {
      await api.delete(`/payment-settings/${confirm.id}`)
      toast.success('Rekening dihapus')
      setConfirm({ open: false, id: null })
      fetch()
    } catch { toast.error('Gagal hapus') }
    setSubmitting(false)
  }

  const toggleActive = async (s) => {
    try {
      const fd = new FormData()
      fd.append('is_active', String(!s.is_active))
      await api.put(`/payment-settings/${s.id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      fetch()
    } catch {}
  }

  if (loading) return <PageLoader />

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-primary text-sm font-semibold mb-1">Pengaturan</p>
          <h1 className="text-3xl font-bold text-white">Rekening & Pembayaran</h1>
          <p className="text-sm text-gray-500 mt-1">
            Kelola rekening bank, e-wallet, QRIS, dan info kontak admin. Otomatis tampil di halaman pembayaran pembeli.
          </p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Tambah Rekening
        </button>
      </div>

      {/* Info */}
      <div className="card mb-6" style={{ borderColor: 'rgba(212,175,55,0.25)', background: 'rgba(212,175,55,0.05)' }}>
        <p className="text-xs text-gray-400 leading-relaxed">
          💡 Rekening yang kamu tambahkan di sini akan <strong className="text-white">otomatis tampil</strong> di halaman pembayaran
          ketika pembeli klik <strong className="text-white">Buy Now</strong> dan memilih metode pembayaran.
          Upload gambar QRIS untuk metode QRIS. Toggle untuk aktifkan/nonaktifkan metode tertentu.
        </p>
      </div>

      {settings.length === 0 ? (
        <EmptyState title="Belum ada rekening" description="Tambah rekening bank atau e-wallet"
          action={<button onClick={openCreate} className="btn-primary">Tambah Rekening</button>} />
      ) : (
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="table-header">
                  <th className="px-4 py-3 text-left">Metode</th>
                  <th className="px-4 py-3 text-left">Label</th>
                  <th className="px-4 py-3 text-left">Rekening / Nomor</th>
                  <th className="px-4 py-3 text-left">Kontak Admin</th>
                  <th className="px-4 py-3 text-left">QR</th>
                  <th className="px-4 py-3 text-left">Aktif</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {settings.map(s => (
                  <tr key={s.id} className="table-row">
                    <td className="px-4 py-3">
                      <span className="text-xs font-bold px-2 py-1 rounded uppercase"
                        style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.2)' }}>
                        {s.method}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-white">{s.label}</td>
                    <td className="px-4 py-3">
                      <p className="text-xs text-gray-300">{s.account_name || '-'}</p>
                      <p className="text-xs text-gray-500">{s.account_no || '-'}</p>
                    </td>
                    <td className="px-4 py-3">
                      {s.whatsapp && <p className="text-xs text-green-400">WA: {s.whatsapp}</p>}
                      {s.telegram && <p className="text-xs text-blue-400">TG: {s.telegram}</p>}
                      {s.email    && <p className="text-xs text-gray-400">{s.email}</p>}
                    </td>
                    <td className="px-4 py-3">
                      {s.qr_image ? (
                        <img src={`/uploads/qris/${s.qr_image}`} alt="QR"
                          className="w-12 h-12 rounded-lg object-cover cursor-pointer"
                          style={{ border: '1px solid #2A2A2A' }}
                          onClick={() => window.open(`/uploads/qris/${s.qr_image}`, '_blank')} />
                      ) : <span className="text-xs text-gray-600">-</span>}
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => toggleActive(s)} className="transition-all hover:scale-110">
                        {s.is_active
                          ? <ToggleRight size={24} className="text-green-400" />
                          : <ToggleLeft  size={24} className="text-gray-600" />}
                      </button>
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      <Modal isOpen={modal.open} onClose={() => setModal({ open: false, edit: null })}
        title={modal.edit ? 'Edit Rekening' : 'Tambah Rekening'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Jenis Metode *</label>
              <select className="input-field" value={form.method}
                onChange={e => setForm({ ...form, method: e.target.value })}>
                {METHOD_OPTIONS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Label Tampil *</label>
              <input type="text" className="input-field" value={form.label}
                onChange={e => setForm({ ...form, label: e.target.value })}
                placeholder="contoh: BCA, DANA, QRIS LowEngine" required />
            </div>
            <div>
              <label className="label">Nama Rekening / Pemilik</label>
              <input type="text" className="input-field" value={form.account_name}
                onChange={e => setForm({ ...form, account_name: e.target.value })}
                placeholder="Nama pemilik rekening" />
            </div>
            <div>
              <label className="label">Nomor Rekening / Nomor HP</label>
              <input type="text" className="input-field" value={form.account_no}
                onChange={e => setForm({ ...form, account_no: e.target.value })}
                placeholder="1234567890 / 0812xxxx" />
            </div>
            <div>
              <label className="label">Nomor WhatsApp Admin</label>
              <input type="text" className="input-field" value={form.whatsapp}
                onChange={e => setForm({ ...form, whatsapp: e.target.value })}
                placeholder="6281234567890 (format intl)" />
            </div>
            <div>
              <label className="label">Username Telegram Admin</label>
              <input type="text" className="input-field" value={form.telegram}
                onChange={e => setForm({ ...form, telegram: e.target.value })}
                placeholder="lowengine (tanpa @)" />
            </div>
            <div>
              <label className="label">Email Konfirmasi</label>
              <input type="email" className="input-field" value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="admin@lowengine.com" />
            </div>
            <div>
              <label className="label">Urutan Tampil</label>
              <input type="number" className="input-field" value={form.sort_order}
                onChange={e => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} />
            </div>
            <div className="col-span-2">
              <label className="label">
                🖼 Gambar QR Code
                <span className="text-xs text-gray-500 ml-2 font-normal">(jpg/png, max 2MB) — untuk QRIS atau QR payment lainnya</span>
              </label>
              <input type="file" accept=".jpg,.jpeg,.png" className="input-field"
                onChange={e => setForm({ ...form, qr_image: e.target.files[0] })} />
              {modal.edit?.qr_image && !form.qr_image && (
                <div className="mt-2 flex items-center gap-2">
                  <img src={`/uploads/qris/${modal.edit.qr_image}`} alt="current"
                    className="w-16 h-16 rounded-lg object-cover" style={{ border: '1px solid #333' }} />
                  <span className="text-xs text-gray-500">QR saat ini (pilih file baru untuk mengganti)</span>
                </div>
              )}
            </div>
            <div className="col-span-2 flex items-center gap-3">
              <input type="checkbox" id="is_active" checked={form.is_active}
                onChange={e => setForm({ ...form, is_active: e.target.checked })}
                className="w-4 h-4" />
              <label htmlFor="is_active" className="text-sm text-gray-300">
                Aktif — tampil sebagai pilihan pembayaran untuk pembeli
              </label>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModal({ open: false, edit: null })} className="flex-1 btn-outline">Batal</button>
            <button type="submit" disabled={submitting} className="flex-1 btn-primary">
              {submitting ? 'Menyimpan...' : modal.edit ? 'Simpan' : 'Tambah'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog isOpen={confirm.open} onClose={() => setConfirm({ open: false, id: null })}
        onConfirm={handleDelete} title="Hapus Rekening"
        message="Yakin ingin menghapus rekening ini?" loading={submitting} />
    </div>
  )
}
