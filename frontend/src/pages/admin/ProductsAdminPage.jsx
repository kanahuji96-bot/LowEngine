import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, Image, Images, FileText } from 'lucide-react'
import { Link } from 'react-router-dom'
import productService from '../../services/productService'
import categoryService from '../../services/categoryService'
import Modal from '../../components/ui/Modal'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import EmptyState from '../../components/ui/EmptyState'
import StatusBadge from '../../components/ui/StatusBadge'
import { PageLoader } from '../../components/ui/LoadingSpinner'
import { formatRupiah, formatDate } from '../../utils/format'
import toast from 'react-hot-toast'

const defaultForm = { category_id: '', name: '', price: '', stock: '', description: '', status: 'active', image: null }

const ProductsAdminPage = () => {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState({ open: false, edit: null })
  const [confirm, setConfirm] = useState({ open: false, id: null })
  const [form, setForm] = useState(defaultForm)
  const [submitting, setSubmitting] = useState(false)

  const fetchData = () => {
    Promise.all([productService.getAll(), categoryService.getAll()])
      .then(([pRes, cRes]) => {
        setProducts(pRes.data.data)
        setCategories(cRes.data.data)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchData() }, [])

  const openCreate = () => {
    setForm(defaultForm)
    setModal({ open: true, edit: null })
  }

  const openEdit = (p) => {
    setForm({ category_id: p.category_id, name: p.name, price: p.price, stock: p.stock, description: p.description || '', status: p.status, image: null })
    setModal({ open: true, edit: p })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => { if (v !== null) fd.append(k, v) })
      if (modal.edit) {
        await productService.update(modal.edit.id, fd)
        toast.success('Produk diperbarui')
      } else {
        await productService.create(fd)
        toast.success('Produk dibuat')
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
          <h1 className="text-3xl font-bold text-white">Produk</h1>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Tambah Produk
        </button>
      </div>

      {products.length === 0 ? (
        <EmptyState title="Belum ada produk" action={<button onClick={openCreate} className="btn-primary">Tambah Produk</button>} />
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
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => {
                  const imgUrl = p.image ? `/uploads/products/${p.image}` : null
                  return (
                    <tr key={p.id} className="table-row">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-dark-300 rounded-lg overflow-hidden flex-shrink-0">
                            {imgUrl ? <img src={imgUrl} alt={p.name} className="w-full h-full object-cover" /> : <Image size={14} className="text-gray-500 m-auto mt-3" />}
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
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link to={`/admin/products/${p.id}/content`}
                            className="p-2 text-gray-400 hover:text-yellow-400 hover:bg-dark-400 rounded-lg transition-colors"
                            title="Kelola Konten Description">
                            <FileText size={14} />
                          </Link>
                          <Link to={`/admin/products/${p.id}/gallery`}
                            className="p-2 text-gray-400 hover:text-blue-400 hover:bg-dark-400 rounded-lg transition-colors"
                            title="Kelola Gallery">
                            <Images size={14} />
                          </Link>
                          <button onClick={() => openEdit(p)} className="p-2 text-gray-400 hover:text-primary hover:bg-dark-400 rounded-lg transition-colors"><Pencil size={14} /></button>
                          <button onClick={() => setConfirm({ open: true, id: p.id })} className="p-2 text-gray-400 hover:text-red-400 hover:bg-dark-400 rounded-lg transition-colors"><Trash2 size={14} /></button>
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

      {/* Modal */}
      <Modal isOpen={modal.open} onClose={() => setModal({ open: false, edit: null })} title={modal.edit ? 'Edit Produk' : 'Tambah Produk'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="label">Nama Produk</label>
              <input type="text" className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div>
              <label className="label">Kategori</label>
              <select className="input-field" value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} required>
                <option value="">Pilih Kategori</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Status</label>
              <select className="input-field" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="active">Aktif</option>
                <option value="inactive">Nonaktif</option>
              </select>
            </div>
            <div>
              <label className="label">Harga (Rp)</label>
              <input type="number" className="input-field" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
            </div>
            <div>
              <label className="label">Stok</label>
              <input type="number" className="input-field" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
            </div>
            <div className="col-span-2">
              <label className="label">Deskripsi</label>
              <textarea className="input-field resize-none" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="col-span-2">
              <label className="label">Gambar Produk (jpg/png, max 2MB)</label>
              <input type="file" accept=".jpg,.jpeg,.png" className="input-field" onChange={(e) => setForm({ ...form, image: e.target.files[0] })} />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModal({ open: false, edit: null })} className="flex-1 btn-outline">Batal</button>
            <button type="submit" disabled={submitting} className="flex-1 btn-primary">{submitting ? 'Menyimpan...' : modal.edit ? 'Simpan' : 'Buat'}</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog isOpen={confirm.open} onClose={() => setConfirm({ open: false, id: null })} onConfirm={handleDelete} title="Hapus Produk" message="Yakin ingin menghapus produk ini?" loading={submitting} />
    </div>
  )
}

export default ProductsAdminPage
