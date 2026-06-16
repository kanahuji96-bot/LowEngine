import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Plus, Trash2, ArrowLeft, GripVertical, Save } from 'lucide-react'
import api from '../../utils/api'
import productService from '../../services/productService'
import { PageLoader } from '../../components/ui/LoadingSpinner'
import toast from 'react-hot-toast'

export default function ProductContentPage() {
  const { productId } = useParams()
  const [product,  setProduct]  = useState(null)
  const [loading,  setLoading]  = useState(true)
  const [saving,   setSaving]   = useState(false)

  const [tableOfContents, setTableOfContents] = useState([])
  const [features,        setFeatures]        = useState([])
  const [fullDescription, setFullDescription] = useState('')
  const [demoLinks,       setDemoLinks]       = useState([])
  const [newToc,    setNewToc]    = useState('')
  const [newFeature,setNewFeature]= useState('')
  const [newDemoText, setNewDemoText] = useState('')
  const [newDemoUrl,  setNewDemoUrl]  = useState('')

  useEffect(() => {
    setLoading(true)
    Promise.all([
      productService.getAll({ status: 'active' }),
      api.get(`/product-content/${productId}`),
    ]).then(([pRes, cRes]) => {
      const found = pRes.data.data.find(p => String(p.id) === String(productId))
      setProduct(found)
      const c = cRes.data.data
      setTableOfContents(c.table_of_contents || [])
      setFeatures(c.features || [])
      setFullDescription(c.full_description || '')
      setDemoLinks(c.demo_links || [])
    }).catch(() => {}).finally(() => setLoading(false))
  }, [productId])

  const handleSave = async () => {
    setSaving(true)
    try {
      await api.post(`/product-content/${productId}`, {
        table_of_contents: tableOfContents,
        features,
        full_description: fullDescription,
        demo_links: demoLinks,
      })
      toast.success('Content berhasil disimpan!')
    } catch {
      toast.error('Gagal menyimpan')
    }
    setSaving(false)
  }

  const addToc = () => {
    if (!newToc.trim()) return
    setTableOfContents([...tableOfContents, newToc.trim()])
    setNewToc('')
  }
  const removeToc = (i) => setTableOfContents(tableOfContents.filter((_, idx) => idx !== i))
  const updateToc = (i, val) => setTableOfContents(tableOfContents.map((t, idx) => idx === i ? val : t))

  const addFeature = () => {
    if (!newFeature.trim()) return
    setFeatures([...features, newFeature.trim()])
    setNewFeature('')
  }
  const removeFeature = (i) => setFeatures(features.filter((_, idx) => idx !== i))
  const updateFeature = (i, val) => setFeatures(features.map((f, idx) => idx === i ? val : f))

  if (loading) return <PageLoader />

  return (
    <div>
      <div className="flex items-center gap-4 mb-2">
        <Link to="/admin/products" className="flex items-center gap-1 text-sm text-gray-500 hover:text-white transition-colors">
          <ArrowLeft size={14} /> Kembali
        </Link>
      </div>

      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <p className="text-primary text-sm font-semibold mb-1">Konten Description</p>
          <h1 className="text-2xl font-black text-white">{product?.name || `Produk #${productId}`}</h1>
          <p className="text-sm text-gray-500 mt-1">
            Kelola Table of Contents, Fitur, dan Deskripsi untuk tab <span className="text-primary">Description</span> produk ini.
            Setiap produk punya konten sendiri — tidak saling ikut-ikutan.
          </p>
        </div>
        <button onClick={handleSave} disabled={saving}
          className="btn-primary flex items-center gap-2">
          <Save size={16} /> {saving ? 'Menyimpan...' : 'Simpan Semua'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ── TABLE OF CONTENTS ── */}
        <div className="card">
          <h2 className="text-base font-bold text-white mb-4">📋 Table of Contents</h2>
          <p className="text-xs text-gray-500 mb-4">Daftar isi yang tampil di tab Description produk ini.</p>

          {/* Add new */}
          <div className="flex gap-2 mb-4">
            <input type="text" value={newToc}
              onChange={e => setNewToc(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addToc()}
              placeholder="Contoh: Kemudahan & Keamanan"
              className="input-field flex-1 text-sm" />
            <button onClick={addToc} className="btn-primary px-3 py-2">
              <Plus size={16} />
            </button>
          </div>

          {/* List */}
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {tableOfContents.length === 0 ? (
              <p className="text-xs text-gray-600 text-center py-4">Belum ada item. Tambahkan di atas.</p>
            ) : tableOfContents.map((item, i) => (
              <div key={i} className="flex items-center gap-2 group">
                <GripVertical size={14} className="text-gray-600 shrink-0" />
                <span className="text-xs text-gray-500 shrink-0 w-5">{i + 1}.</span>
                <input type="text" value={item}
                  onChange={e => updateToc(i, e.target.value)}
                  className="flex-1 text-sm bg-transparent border-b outline-none py-1 text-gray-300 focus:text-white"
                  style={{ borderColor: '#2A2A2A' }} />
                <button onClick={() => removeToc(i)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-red-400 hover:text-red-300 transition-all">
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>

          {tableOfContents.length > 0 && (
            <p className="text-xs text-gray-600 mt-3">{tableOfContents.length} item</p>
          )}
        </div>

        {/* ── FEATURES / KEMUDAHAN ── */}
        <div className="card">
          <h2 className="text-base font-bold text-white mb-4">✅ Fitur & Kemudahan</h2>
          <p className="text-xs text-gray-500 mb-4">Daftar fitur yang tampil di section "Kemudahan & Keamanan".</p>

          {/* Add new */}
          <div className="flex gap-2 mb-4">
            <input type="text" value={newFeature}
              onChange={e => setNewFeature(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addFeature()}
              placeholder="Contoh: Instalasi mudah & lengkap"
              className="input-field flex-1 text-sm" />
            <button onClick={addFeature} className="btn-primary px-3 py-2">
              <Plus size={16} />
            </button>
          </div>

          {/* List */}
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {features.length === 0 ? (
              <p className="text-xs text-gray-600 text-center py-4">Belum ada fitur. Tambahkan di atas.</p>
            ) : features.map((f, i) => (
              <div key={i} className="flex items-center gap-2 group">
                <GripVertical size={14} className="text-gray-600 shrink-0" />
                <span className="text-xs text-green-500 shrink-0">✓</span>
                <input type="text" value={f}
                  onChange={e => updateFeature(i, e.target.value)}
                  className="flex-1 text-sm bg-transparent border-b outline-none py-1 text-gray-300 focus:text-white"
                  style={{ borderColor: '#2A2A2A' }} />
                <button onClick={() => removeFeature(i)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-red-400 hover:text-red-300 transition-all">
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>

          {features.length > 0 && (
            <p className="text-xs text-gray-600 mt-3">{features.length} fitur</p>
          )}
        </div>

        {/* ── DEMO LINKS ── */}
        <div className="card lg:col-span-2">
          <h2 className="text-base font-bold text-white mb-4">🔗 Link Demo Website</h2>
          <p className="text-xs text-gray-500 mb-4">
            Link demo yang tampil di section "Demo Lengkap". Setiap produk punya link berbeda.
          </p>

          {/* Add new */}
          <div className="flex gap-2 mb-4 flex-wrap">
            <input type="text" value={newDemoText}
              onChange={e => setNewDemoText(e.target.value)}
              placeholder="Nama (contoh: Nexus)"
              className="input-field text-sm" style={{ minWidth: 150, flex: '0 0 auto', width: 160 }} />
            <input type="text" value={newDemoUrl}
              onChange={e => setNewDemoUrl(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && newDemoText && newDemoUrl) { setDemoLinks([...demoLinks, { text: newDemoText, url: newDemoUrl }]); setNewDemoText(''); setNewDemoUrl('') } }}
              placeholder="URL (contoh: https://nexus.scatterwin.net/)"
              className="input-field flex-1 text-sm" />
            <button
              onClick={() => { if (newDemoText && newDemoUrl) { setDemoLinks([...demoLinks, { text: newDemoText, url: newDemoUrl }]); setNewDemoText(''); setNewDemoUrl('') } }}
              className="btn-primary px-3 py-2 shrink-0">
              <Plus size={16} />
            </button>
          </div>

          {/* List */}
          <div className="space-y-2">
            {demoLinks.length === 0 ? (
              <p className="text-xs text-gray-600 text-center py-4">Belum ada link demo. Tambahkan di atas.</p>
            ) : demoLinks.map((link, i) => (
              <div key={i} className="flex items-center gap-2 group p-2 rounded-lg"
                style={{ background: '#111', border: '1px solid #2A2A2A' }}>
                <input type="text" value={link.text}
                  onChange={e => setDemoLinks(demoLinks.map((l, idx) => idx === i ? { ...l, text: e.target.value } : l))}
                  className="text-sm bg-transparent border-b outline-none py-1 text-gray-300 focus:text-white w-32 shrink-0"
                  style={{ borderColor: '#2A2A2A' }} placeholder="Nama" />
                <span className="text-gray-600 shrink-0">→</span>
                <input type="text" value={link.url}
                  onChange={e => setDemoLinks(demoLinks.map((l, idx) => idx === i ? { ...l, url: e.target.value } : l))}
                  className="flex-1 text-sm bg-transparent border-b outline-none py-1 focus:text-white"
                  style={{ borderColor: '#2A2A2A', color: '#e53e3e' }} placeholder="https://..." />
                <button onClick={() => setDemoLinks(demoLinks.filter((_, idx) => idx !== i))}
                  className="opacity-0 group-hover:opacity-100 p-1 text-red-400 hover:text-red-300 transition-all shrink-0">
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ── FULL DESCRIPTION ── */}
        <div className="card lg:col-span-2">
          <h2 className="text-base font-bold text-white mb-4">📝 Deskripsi Lengkap</h2>
          <p className="text-xs text-gray-500 mb-4">
            Teks deskripsi panjang produk ini. Tampil di tab Description setelah Table of Contents.
          </p>
          <textarea
            className="input-field w-full resize-none"
            rows={8}
            value={fullDescription}
            onChange={e => setFullDescription(e.target.value)}
            placeholder="Tuliskan deskripsi lengkap produk ini..."
          />
          <p className="text-xs text-gray-600 mt-2">{fullDescription.length} karakter</p>
        </div>

      </div>

      {/* Save button bottom */}
      <div className="flex justify-end mt-6">
        <button onClick={handleSave} disabled={saving}
          className="btn-primary flex items-center gap-2 px-8">
          <Save size={16} /> {saving ? 'Menyimpan...' : 'Simpan Semua Perubahan'}
        </button>
      </div>

      {/* Info */}
      <div className="card mt-4" style={{ borderColor: 'rgba(212,175,55,0.2)', background: 'rgba(212,175,55,0.03)' }}>
        <p className="text-xs text-gray-500 leading-relaxed">
          💡 <strong className="text-white">Cara kerja:</strong> Konten yang kamu simpan di sini akan tampil di tab
          <span className="text-primary"> Description</span> halaman detail produk <strong className="text-white">{product?.name}</strong>.
          Setiap produk punya konten terpisah — mengubah produk ini tidak akan mempengaruhi produk lain.
          Klik <strong className="text-white">Simpan Semua</strong> untuk menyimpan perubahan.
        </p>
      </div>
    </div>
  )
}
