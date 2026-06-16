import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Plus, Pencil, Trash2, Image } from 'lucide-react'
import productService from '../../services/productService'
import categoryService from '../../services/categoryService'
import Modal from '../../components/ui/Modal'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import EmptyState from '../../components/ui/EmptyState'
import StatusBadge from '../../components/ui/StatusBadge'
import { PageLoader } from '../../components/ui/LoadingSpinner'
import { formatRupiah } from '../../utils/format'
import toast from 'react-hot-toast'

const SECTION_LABELS = {
  trending: { label: 'Trending Items',  color: 'text-yellow-400', desc: 'Produk yang tampil di section Trending Items halaman utama' },
  featured: { label: 'Featured Items',  color: 'text-blue-400',   desc: 'Produk yang tampil di section Featured Items halaman utama' },
  newest:   { label: 'Newest Items',    color: 'text-green-400',  desc: 'Produk yang tampil di section Newest Items halaman utama' },
  free:     { label: 'Free Items',      color: 'text-purple-400', desc: 'Produk yang tampil di section Free Items halaman utama' },
}

const defaultForm = { category_id: '', name: '', price: '', stock: '', description: '', status: 'active', image: null }

export default function SectionProductsPage() {
  const { section } = useParams()
  const info = SECTION_LABELS[section] || { label: section, color: 'text-white', desc: '' }

  const [products,   setProducts]   = useState([])
  const [categories, setCategories] = useState([])
  const [loading,    setLoading]    = useState(true)
  const [modal,      setModal]      = useState({ open: false, edit: null })
  const [confirm,    setConfirm]    = useState({ open: false, id: null })
  const [form,       setForm]       = useState(defaultForm)
  const [submitting, setSubmitting] = useState(false)

  const fetchData = () => {
    setLoading(true)
    Promise.all([
      productService.getAll({ section }),
      categoryService.getAll(),
    ]).then(([p, c]) => {
      setProducts(p.data.data)
      setCategories(c.data.data)
    }).catch(() => {}).finally(() => setLoading(false))
  }

  useEffect(() => { fetchData() }, [section])

  const openCreate = () => { setForm(defaultForm); setModal({ open: true, edit: null }) }
  const openEdit   = (p) => {
    setForm({ category_id: p.category_id, name: p.name, price: p.price, stock: p.stock, description: p.description || '', status: p.status, image: null })
    setModal({ open: true, edit: p })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => { if (v !== null && v !== '') fd.append(k, v) })
      fd.append('section', section) // selalu set section sesuai halaman
      if (modal.edit) {
        await productService.update(modal.edit.id, fd)
        toast.success('Produk diperbarui')
      } else {
        await productService.create(fd)
        toast.success('Produk ditambahkan ke ' + info.label)
      }
      setModal({ open: false, edit: null })
      fetchData()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal')
    }
    setSubmitting(false)
  }

  const handleDelete = async () => {
    setSubmitting(true)
    try {
      await productService.remove(confirm.id)
      toast.success('Produk dihapus')
      setConfirm({ open: false, id: null })
      fetchData()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal')
    }
    setSubmitting(false)
  }

  if (loading) return <PageLoader />

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className={`text-sm font-bold uppercase tracking-widest mb-1 ${info.color}`}>
            Landing Page Section
          </p>
          <h1 className="text-3xl font-black text-white">{info.label}</h1>
          <p className="text-sm text-gray-500 mt-1">{info.desc}</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Tambah Produk
        </button>
      </div>

      {/* Info box */}
      <div className="card mb-6 mt-4 flex items-start gap-3"
        style={{ borderColor: 'rgba(212,175,55,0.25)', background: 'rgba(212,175,55,0.05)' }}>
        <div className="text-xl">💡</div>
        <div>
          <p className="text-sm font-semibold text-white mb-1">Cara kerja section ini</p>
          <p className="text-xs text-gray-400 leading-relaxed">
            Produk yang kamu tambahkan di sini <strong className="text-white">hanya akan tampil</strong> di section <span className={`font-bold ${info.color}`}>{info.label}</span> pada landing page.
            Upload gambar produk di sini, dan gambar akan langsung muncul di section tersebut tanpa mempengaruhi section lain.
          </p>
        </div>
      </div>

      {/* Table */}
      {products.length === 0 ? (
        <EmptyState
          title={`Belum ada produk di ${info.label}`}
          description="Tambah produk untuk ditampilkan di section ini"
          action={<button onClick={openCreate} className="btn-primary">Tambah Produk</button>}
        />
      ) : (
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="table-header">
                  <th className="px-4 py-3 text-left">Produk</th>
                  <th className="px-4 py-3 text-left">Kategori</th>
                  <th className="px-4 py-3 text-left">Harga</th>
                  <th className="px-4 py-3 text-left">Stok</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Gambar</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => {
                  const imgUrl = p.image ? `/uploads/products/${p.image}` : null
                  return (
                    <tr key={p.id} className="table-row">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0"
                            style={{ background: '#111', border: '1px solid #2A2A2A' }}>
                            {imgUrl
                              ? <img src={imgUrl} alt={p.name} className="w-full h-full object-cover" />
                              : <div className="w-full h-full flex items-center justify-center">
                                  <Image size={14} className="text-gray-600" />
                                </div>
                            }
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">{p.name}</p>
                            <p className="text-xs text-gray-500">{p.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-400">{p.Category?.name || '-'}</td>
                      <td className="px-4 py-3 text-sm text-primary font-semibold">{formatRupiah(p.price)}</td>
                      <td className="px-4 py-3 text-sm text-white">{p.stock}</td>
                      <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                      <td className="px-4 py-3">
                        {imgUrl
                          ? <span className="text-xs text-green-400 font-semibold">✓ Ada gambar</span>
                          : <span className="text-xs text-red-400 font-semibold">✗ Belum ada</span>
                        }
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => openEdit(p)}
                            className="p-2 text-gray-400 hover:text-primary hover:bg-dark-400 rounded-lg transition-colors"
                            title="Edit & Upload Gambar">
                            <Pencil size={14} />
                          </button>
                          <button onClick={() => setConfirm({ open: true, id: p.id })}
                            className="p-2 text-gray-400 hover:text-red-400 hover:bg-dark-400 rounded-lg transition-colors"
                            title="Hapus">
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
        title={modal.edit ? `Edit Produk — ${info.label}` : `Tambah Produk ke ${info.label}`}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="label">Nama Produk</label>
              <input type="text" className="input-field" value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div>
              <label className="label">Kategori</label>
              <select className="input-field" value={form.category_id}
                onChange={e => setForm({ ...form, category_id: e.target.value })} required>
                <option value="">Pilih Kategori</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Status</label>
              <select className="input-field" value={form.status}
                onChange={e => setForm({ ...form, status: e.target.value })}>
                <option value="active">Aktif</option>
                <option value="inactive">Nonaktif</option>
              </select>
            </div>
            <div>
              <label className="label">Harga (Rp)</label>
              <input type="number" className="input-field" value={form.price}
                onChange={e => setForm({ ...form, price: e.target.value })}
                placeholder={section === 'free' ? '0' : ''} />
            </div>
            <div>
              <label className="label">Stok</label>
              <input type="number" className="input-field" value={form.stock}
                onChange={e => setForm({ ...form, stock: e.target.value })} />
            </div>
            <div className="col-span-2">
              <label className="label">Deskripsi</label>
              <textarea className="input-field resize-none" rows={2} value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })} />
            </div>
            {/* Upload gambar — bagian utama */}
            <div className="col-span-2">
              <label className="label">
                🖼 Gambar Produk
                <span className="text-xs text-gray-500 ml-2 font-normal">
                  (jpg/png, max 2MB) — Gambar ini akan tampil di section <span className={info.color}>{info.label}</span>
                </span>
              </label>
              <input type="file" accept=".jpg,.jpeg,.png" className="input-field"
                onChange={e => setForm({ ...form, image: e.target.files[0] })} />
              {modal.edit?.image && !form.image && (
                <div className="mt-2 flex items-center gap-2">
                  <img src={`/uploads/products/${modal.edit.image}`} alt="current"
                    className="w-16 h-16 rounded-lg object-cover" style={{ border: '1px solid #333' }} />
                  <span className="text-xs text-gray-500">Gambar saat ini (pilih file baru untuk mengganti)</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModal({ open: false, edit: null })}
              className="flex-1 btn-outline">Batal</button>
            <button type="submit" disabled={submitting} className="flex-1 btn-primary">
              {submitting ? 'Menyimpan...' : modal.edit ? 'Simpan Perubahan' : 'Tambah ke ' + info.label}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={confirm.open}
        onClose={() => setConfirm({ open: false, id: null })}
        onConfirm={handleDelete}
        title="Hapus Produk"
        message="Yakin ingin menghapus produk ini dari section ini?"
        loading={submitting}
      />
    </div>
  )
}
