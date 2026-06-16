import { useState, useEffect } from 'react'
import { Search, Tag, AlignJustify, Share2, Calendar } from 'lucide-react'
import api from '../../utils/api'
import { PageLoader } from '../../components/ui/LoadingSpinner'
import toast from 'react-hot-toast'

const ALL_COLORS = ['#1a1a2a','#1a2a1a','#2a1a0a','#0a1a2a','#1a0a1a','#0a2a1a']

export default function ServicesPage() {
  const [services,    setServices]    = useState([])
  const [loading,     setLoading]     = useState(true)
  const [search,      setSearch]      = useState('')
  const [activeTag,   setActiveTag]   = useState('')
  const [showCatMenu, setShowCatMenu] = useState(false)

  useEffect(() => {
    api.get('/services?status=active')
      .then(r => setServices(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const allTags = [...new Set(services.flatMap(s => s.tags ? s.tags.split(',').map(t => t.trim()) : []))]

  const filtered = services.filter(s => {
    const matchSearch = !search || s.title.toLowerCase().includes(search.toLowerCase())
    const matchTag    = !activeTag || (s.tags && s.tags.split(',').map(t => t.trim()).includes(activeTag))
    return matchSearch && matchTag
  })

  const handleShare = (e, s) => {
    e.preventDefault()
    navigator.clipboard?.writeText(window.location.origin + '/services')
    toast.success('Link disalin!')
  }

  if (loading) return <PageLoader />

  return (
    <div style={{ background: '#0A0A0A', minHeight: '100vh' }}>
      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* ── Search & filter bar ── */}
        <div className="flex items-center gap-3 mb-8 flex-wrap">
          {/* Categories button */}
          <div className="relative">
            <button
              onClick={() => setShowCatMenu(!showCatMenu)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
              style={{ background: '#1A1A1A', border: '1px solid #2A2A2A', color: '#D4AF37' }}>
              <Tag size={14} />
              Categories
            </button>
            {showCatMenu && (
              <div className="absolute top-full left-0 mt-1 rounded-xl overflow-hidden py-2 z-50 min-w-[160px]"
                style={{ background: '#1A1A1A', border: '1px solid #2A2A2A', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
                <button
                  onClick={() => { setActiveTag(''); setShowCatMenu(false) }}
                  className="w-full text-left px-4 py-2 text-sm transition-colors"
                  style={{ color: !activeTag ? '#D4AF37' : '#9ca3af' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(212,175,55,0.06)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  Semua
                </button>
                {allTags.map(tag => (
                  <button key={tag}
                    onClick={() => { setActiveTag(tag); setShowCatMenu(false) }}
                    className="w-full text-left px-4 py-2 text-sm transition-colors capitalize"
                    style={{ color: activeTag === tag ? '#D4AF37' : '#9ca3af' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(212,175,55,0.06)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    {tag}
                  </button>
                ))}
              </div>
            )}
          </div>

          <span className="text-sm text-gray-500">
            Total <span className="text-white font-semibold">{filtered.length}</span> artikel.
          </span>

          <div className="flex items-center gap-2 flex-1 min-w-[200px] rounded-lg overflow-hidden"
            style={{ background: '#1A1A1A', border: '1px solid #2A2A2A' }}>
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search articles..."
              className="flex-1 px-4 py-2 bg-transparent text-sm text-white placeholder-gray-600 outline-none" />
            <button className="px-3 py-2 text-gray-400 hover:text-white transition-colors">
              <Search size={15} />
            </button>
            <div className="w-px h-5" style={{ background: '#2A2A2A' }} />
            <button className="px-3 py-2 text-gray-400 hover:text-white transition-colors">
              <AlignJustify size={15} />
            </button>
          </div>
        </div>

        {/* ── Section title ── */}
        <div className="mb-6">
          <h1 className="text-2xl font-black text-white mb-2">Services Category</h1>
          <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
            Temukan layanan profesional kami untuk pengembangan website toko online.
            Akses panduan ahli, tips, dan solusi teknis untuk membangun toko online yang lengkap.
          </p>
          <button className="text-sm mt-1 font-semibold" style={{ color: '#D4AF37' }}>readmore</button>
        </div>

        {/* Active tag filter pill */}
        {activeTag && (
          <div className="flex items-center gap-2 mb-6">
            <span className="text-xs text-gray-500">Filter:</span>
            <button onClick={() => setActiveTag('')}
              className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold"
              style={{ background: 'rgba(212,175,55,0.15)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.3)' }}>
              {activeTag} ✕
            </button>
          </div>
        )}

        {/* ── Services grid ── */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600">Belum ada service tersedia</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filtered.map((s, idx) => {
              const imgUrl = s.image ? `/uploads/services/${s.image}` : null
              const tags   = s.tags ? s.tags.split(',').map(t => t.trim()) : []
              return (
                <div key={s.id}
                  className="group rounded-xl overflow-hidden transition-all duration-200 hover:-translate-y-1 flex flex-col"
                  style={{ background: '#1A1A1A', border: '1px solid #2A2A2A', boxShadow: '0 2px 8px rgba(0,0,0,0.4)' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(212,175,55,0.35)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = '#2A2A2A'}>

                  {/* Thumbnail */}
                  <div className="relative overflow-hidden"
                    style={{ height: 140, background: imgUrl ? '#111' : ALL_COLORS[idx % ALL_COLORS.length] }}>
                    {imgUrl ? (
                      <img src={imgUrl} alt={s.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center px-4">
                          <div className="text-3xl mb-2">🛠️</div>
                          <p className="text-xs text-gray-500 line-clamp-2 leading-snug">{s.title}</p>
                        </div>
                      </div>
                    )}
                    {/* Date */}
                    <div className="absolute top-2 left-2 flex items-center gap-1 text-[10px] font-bold text-white bg-black/60 px-2 py-0.5 rounded">
                      <Calendar size={9} />
                      {s.date || new Date(s.created_at).toLocaleDateString('id-ID')}
                    </div>
                    {/* Share */}
                    <button onClick={(e) => handleShare(e, s)}
                      className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center transition-all hover:scale-110"
                      style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.15)' }}>
                      <Share2 size={10} className="text-white" />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="text-sm font-semibold leading-snug mb-3 transition-colors group-hover:text-[#D4AF37]"
                      style={{ color: '#e5e7eb' }}>
                      {s.title}
                    </h3>
                    {s.description && (
                      <p className="text-xs text-gray-600 line-clamp-2 mb-3 leading-relaxed">{s.description}</p>
                    )}
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mt-auto">
                      {tags.map(tag => (
                        <button key={tag} onClick={() => setActiveTag(tag)}
                          className="px-2 py-0.5 rounded text-[10px] font-semibold capitalize transition-all hover:bg-[#D4AF37] hover:text-black"
                          style={{ background: 'rgba(255,255,255,0.06)', color: '#9ca3af', border: '1px solid #333' }}>
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

      </div>
    </div>
  )
}
