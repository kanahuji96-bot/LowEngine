import { Link } from 'react-router-dom'
import {
  Info, BookOpen, Tag, CheckCircle2,
  Youtube, Facebook, Twitter, Send, Instagram,
  ArrowUp
} from 'lucide-react'
import { useLang } from '../../hooks/useLang'
import { useEffect, useState } from 'react'
import categoryService from '../../services/categoryService'

const ScrollTop = () => {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const fn = () => setShow(window.scrollY > 400)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])
  if (!show) return null
  return (
    <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-6 right-6 z-50 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
      style={{ background: '#e53e3e', boxShadow: '0 4px 12px rgba(229,62,62,0.4)' }}>
      <ArrowUp size={18} className="text-white" />
    </button>
  )
}

export default function GlobalFooter() {
  const { tr } = useLang()
  const [categories, setCategories] = useState([])

  useEffect(() => {
    categoryService.getAll().then(r => setCategories(r.data.data)).catch(() => {})
  }, [])

  return (
    <>
      <ScrollTop />
      <div style={{ background: '#111', position: 'relative', borderTop: '1px solid #1A1A1A' }}>
        {/* Wave */}
        <div style={{ lineHeight: 0, background: '#0A0A0A' }}>
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
            <path d="M0,0 C120,80 240,80 360,40 C480,0 600,80 720,60 C840,40 960,80 1080,50 C1200,20 1320,70 1440,40 L1440,80 L0,80 Z" fill="#111"/>
          </svg>
        </div>

        <div className="max-w-6xl mx-auto px-6 pt-6 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

            {/* About us */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Info size={14} className="text-gray-300" />
                <h4 className="text-sm font-bold text-white">{tr('footer_about')}</h4>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed mb-5">{tr('footer_about_desc')}</p>
              <div className="mb-3">
                <span className="text-xl font-black italic tracking-wide"
                  style={{ background: 'linear-gradient(90deg,#D4AF37,#F0D060,#B8960C)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  LowEngine
                </span>
              </div>
              <p className="text-xs text-gray-500 mb-4">{tr('footer_connect')}</p>
              <div className="flex items-center gap-2 flex-wrap">
                {[
                  { Icon: Youtube,   color: '#ff0000' },
                  { Icon: Facebook,  color: '#1877f2' },
                  { Icon: Twitter,   color: '#1da1f2' },
                  { Icon: Send,      color: '#0088cc' },
                  { Icon: Instagram, color: '#e1306c' },
                ].map(({ Icon, color }, i) => (
                  <a key={i} href="#"
                    className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                    style={{ background: '#333', border: '1px solid #444' }}
                    onMouseEnter={e => e.currentTarget.style.background = color}
                    onMouseLeave={e => e.currentTarget.style.background = '#333'}>
                    <Icon size={14} className="text-gray-300" />
                  </a>
                ))}
                {/* WhatsApp */}
                <a href="#"
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                  style={{ background: '#333', border: '1px solid #444' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#25d366'}
                  onMouseLeave={e => e.currentTarget.style.background = '#333'}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" fill="#9ca3af"/>
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.978-1.404A9.953 9.953 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a7.95 7.95 0 01-4.071-1.115l-.29-.174-3.007.847.854-2.927-.19-.301A7.96 7.96 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" fill="#9ca3af"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Support Center */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <BookOpen size={14} className="text-gray-300" />
                <h4 className="text-sm font-bold text-white">{tr('footer_support')}</h4>
              </div>
              <ul className="space-y-2">
                {[
                  { key: 'footer_contact',    to: '/products' },
                  { key: 'footer_about_link', to: '/products' },
                  { key: 'footer_download',   to: '/products' },
                  { key: 'footer_membership', to: '/membership' },
                  { key: 'footer_privacy',    to: '/products' },
                  { key: 'footer_terms',      to: '/products' },
                  { key: 'footer_licenses',   to: '/products' },
                ].map(({ key, to }) => (
                  <li key={key}>
                    <Link to={to} className="text-xs text-gray-400 hover:text-white transition-colors">{tr(key)}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Categories */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Tag size={14} className="text-gray-300" />
                <h4 className="text-sm font-bold text-white">{tr('footer_categories')}</h4>
              </div>
              <ul className="space-y-2">
                {categories.length > 0
                  ? categories.slice(0, 3).map(c => (
                      <li key={c.id}>
                        <Link to={`/category?category_id=${c.id}&name=${encodeURIComponent(c.name)}`}
                          className="text-xs text-gray-400 hover:text-white transition-colors">{c.name}</Link>
                      </li>
                    ))
                  : ['Slot Game Script','Sportsbook Script','Casino Game Script'].map(l => (
                      <li key={l}><Link to="/products" className="text-xs text-gray-400 hover:text-white transition-colors">{l}</Link></li>
                    ))
                }
                <li><Link to="/products" className="text-xs text-gray-400 hover:text-white transition-colors">{tr('footer_all_cat')}</Link></li>
              </ul>
            </div>

            {/* Product Filters */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 size={14} className="text-gray-300" />
                <h4 className="text-sm font-bold text-white">{tr('footer_filters')}</h4>
              </div>
              <ul className="space-y-2">
                {[
                  { key: 'footer_flash',       to: '/filter?filter=flash'    },
                  { key: 'footer_featured',    to: '/filter?filter=featured' },
                  { key: 'footer_trending',    to: '/filter?filter=trending' },
                  { key: 'footer_newest',      to: '/filter?filter=newest'   },
                  { key: 'footer_free',        to: '/filter?filter=free'     },
                  { key: 'footer_all_filters', to: '/filter?filter=all'      },
                ].map(({ key, to }) => (
                  <li key={key}>
                    <Link to={to} className="text-xs text-gray-400 hover:text-white transition-colors">{tr(key)}</Link>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid #222' }}>
          <div className="max-w-6xl mx-auto px-6 py-4">
            <div className="flex items-center justify-center gap-6 mb-3 flex-wrap">
              {[
                { key: 'footer_bottom_membership', to: '/membership' },
                { key: 'footer_bottom_affiliate',  to: '/products'   },
                { key: 'footer_bottom_blog',       to: '/products'   },
                { key: 'footer_bottom_member',     to: '/login'      },
                { key: 'footer_bottom_guest',      to: '/register'   },
                { key: 'footer_bottom_lang',       to: '/'           },
              ].map(({ key, to }) => (
                <Link key={key} to={to} className="text-xs text-gray-500 hover:text-white transition-colors">{tr(key)}</Link>
              ))}
            </div>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <p className="text-xs text-gray-600">{tr('footer_copyright')}</p>
              <span className="text-gray-700 text-xs">·</span>
              <p className="text-xs text-gray-600">{tr('footer_powered')}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
