import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Plus, Trash2, ArrowLeft, Image } from 'lucide-react'
import api from '../../utils/api'
import productService from '../../services/productService'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import { PageLoader } from '../../components/ui/LoadingSpinner'
import toast from 'react-hot-toast'

export default function ProductGalleryPage() {
  const { productId } = useParams()
  const [product,    setProduct]    = useState(null)
  const [gallery,    setGallery]    = useState([])
  const [loading,    setLoading]    = useState(true)
  const [uploading,  setUploading]  = useState(false)
  const [confirm,    setConfirm]    = useState({ open: false, id: null })
  const [submitting, setSubmitting] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState([])

  const fetchGallery = () => {
    api.get(`/gallery/product/${productId}`)
      .then(r => setGallery(r.data.data))
      .catch(() => {})
  }

  useEffect(() => {
    setLoading(true)
    Promise.all([
      productService.getAll({ status: 'active' }),
      api.get(`/gallery/product/${productId}`),
    ]).then(([pRes, gRes]) => {
      const found = pRes.data.data.find(p => String(p.id) === String(productId))
      setProduct(found)
      setGallery(gRes.data.data)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [productId])

  const handleUpload = async () => {
    if (!selectedFiles.length) { toast.error('Pilih minimal 1 gambar'); return }
    setUploading(true)
    let uploaded = 0
    for (const file of selectedFiles) {
      const fd = new FormData()
      fd.append('image', file)
      try {
        await api.post(`/gallery/product/${productId}`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        uploaded++
      } catch {}
    }
    toast.success(`${uploaded} gambar berhasil diupload`)
    setSelectedFiles([])
    fetchGallery()
    setUploading(false)
  }

  const handleDelete = async () => {
    setSubmitting(true)
    try {
      await api.delete(`/gallery/${confirm.id}`)
      toast.success('Gambar dihapus')
      setConfirm({ open: false, id: null })
      fetchGallery()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal hapus')
    }
    setSubmitting(false)
  }

  const handleClearAll = async () => {
    if (!window.confirm('Hapus SEMUA gambar gallery produk ini?')) return
    try {
      await api.delete(`/gallery/clear/${productId}`)
      toast.success('Semua gambar dihapus')
      fetchGallery()
    } catch { toast.error('Gagal') }
  }

  if (loading) return <PageLoader />

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-2">
        <Link to="/admin/products" className="flex items-center gap-1 text-sm text-gray-500 hover:text-white transition-colors">
          <ArrowLeft size={14} /> Kembali
        </Link>
      </div>

      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <p className="text-primary text-sm font-semibold mb-1">Gallery Produk</p>
          <h1 className="text-2xl font-black text-white">{product?.name || `Produk #${productId}`}</h1>
          <p className="text-sm text-gray-500 mt-1">
            Gambar-gambar ini tampil di tab <span className="text-primary">Description</span> halaman detail produk.
            Setiap produk punya gallery sendiri.
          </p>
        </div>
        {gallery.length > 0 && (
          <button onClick={handleClearAll} className="btn-danger text-sm flex items-center gap-1">
            <Trash2 size={14} /> Hapus Semua
          </button>
        )}
      </div>

      {/* Info box */}
      <div className="card mb-6" style={{ borderColor: 'rgba(212,175,55,0.25)', background: 'rgba(212,175,55,0.05)' }}>
        <p className="text-sm font-semibold text-white mb-1">💡 Cara kerja Gallery</p>
        <p className="text-xs text-gray-400 leading-relaxed">
          Upload gambar-gambar untuk produk <strong className="text-white">{product?.name}</strong> di sini.
          Gambar akan tampil di section gallery tab Description halaman detail produk.
          Setiap produk punya gallery yang berbeda dan terpisah — tidak saling mengikuti.
        </p>
      </div>

      {/* Upload area */}
      <div className="card mb-6">
        <h2 className="text-base font-semibold text-white mb-4">Upload Gambar Baru</h2>
        <div className="space-y-4">
          <div>
            <label className="label">
              Pilih Gambar (jpg/png, max 2MB, bisa pilih banyak sekaligus)
            </label>
            <input
              type="file"
              accept=".jpg,.jpeg,.png"
              multiple
              className="input-field"
              onChange={e => setSelectedFiles(Array.from(e.target.files))}
            />
            {selectedFiles.length > 0 && (
              <p className="text-xs text-primary mt-2">{selectedFiles.length} file dipilih</p>
            )}
          </div>

          {/* Preview selected files */}
          {selectedFiles.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedFiles.map((file, i) => (
                <div key={i} className="relative">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="w-20 h-20 rounded-lg object-cover"
                    style={{ border: '1px solid #2A2A2A' }}
                  />
                  <span className="absolute -bottom-1 left-0 right-0 text-center text-[9px] text-gray-500 truncate px-1">
                    {file.name.slice(0, 12)}
                  </span>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={uploading || selectedFiles.length === 0}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={16} />
            {uploading ? `Mengupload...` : `Upload ${selectedFiles.length > 0 ? selectedFiles.length + ' Gambar' : 'Gambar'}`}
          </button>
        </div>
      </div>

      {/* Gallery grid */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-white">
            Gallery ({gallery.length} gambar)
          </h2>
          <span className="text-xs text-gray-500">
            Klik 🗑 untuk hapus gambar tertentu
          </span>
        </div>

        {gallery.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: '#1A1A1A' }}>
              <Image size={32} className="text-gray-600" />
            </div>
            <p className="text-gray-500 text-sm">Belum ada gambar gallery</p>
            <p className="text-gray-600 text-xs mt-1">Upload gambar di atas untuk ditampilkan di tab Description</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {gallery.map((item, i) => (
              <div key={item.id} className="relative group">
                <div className="rounded-xl overflow-hidden aspect-video"
                  style={{ background: '#111', border: '1px solid #2A2A2A' }}>
                  <img
                    src={`/uploads/gallery/${item.image}`}
                    alt={`Gallery ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Delete button */}
                <button
                  onClick={() => setConfirm({ open: true, id: item.id })}
                  className="absolute top-1.5 right-1.5 w-7 h-7 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                  style={{ background: 'rgba(239,68,68,0.9)' }}
                >
                  <Trash2 size={12} className="text-white" />
                </button>
                <p className="text-[10px] text-gray-600 text-center mt-1">#{i + 1}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={confirm.open}
        onClose={() => setConfirm({ open: false, id: null })}
        onConfirm={handleDelete}
        title="Hapus Gambar Gallery"
        message="Yakin ingin menghapus gambar ini dari gallery?"
        loading={submitting}
      />
    </div>
  )
}
