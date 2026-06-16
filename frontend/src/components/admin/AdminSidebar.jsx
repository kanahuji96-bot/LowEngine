import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Tag, Package, ShoppingBag,
  CreditCard, Star, FileSpreadsheet, FileText,
  LogOut, Package2, Flame, Sparkles, Clock, Gift, Wrench, Wallet
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

const links = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { to: '/admin/categories', label: 'Kategori', icon: Tag },
  { to: '/admin/products', label: 'Semua Produk', icon: Package },
  { to: '/admin/services', label: 'Services', icon: Wrench },
  { to: '/admin/orders', label: 'Order', icon: ShoppingBag },
  { to: '/admin/payments', label: 'Pembayaran', icon: CreditCard },
  { to: '/admin/payment-settings', label: 'Rekening & QRIS', icon: Wallet },
  { to: '/admin/reviews', label: 'Review', icon: Star },
]

const sectionLinks = [
  { to: '/admin/section/trending', label: 'Trending Items', icon: Flame },
  { to: '/admin/section/featured', label: 'Featured Items', icon: Sparkles },
  { to: '/admin/section/newest',   label: 'Newest Items',  icon: Clock },
  { to: '/admin/section/free',     label: 'Free Items',    icon: Gift },
]

const exportLinks = [
  { to: '/admin/export', label: 'Export Excel / PDF', icon: FileSpreadsheet },
]

const AdminSidebar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout } = useAuth()

  const isActive = (path, exact) => {
    if (exact) return location.pathname === path
    return location.pathname.startsWith(path)
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-dark-100 border-r border-dark-400 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-dark-400">
        <Link to="/admin" className="flex items-center gap-2">
          <span className="text-base font-black italic tracking-wide gold-text">LowEngine</span>
          <p className="text-xs text-gray-500">Admin Panel</p>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <p className="text-xs text-gray-600 font-semibold uppercase tracking-wider px-4 mb-2">Menu</p>
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`sidebar-link ${isActive(link.to, link.exact) ? 'active' : ''}`}
          >
            <link.icon size={18} />
            <span className="text-sm">{link.label}</span>
          </Link>
        ))}

        <p className="text-xs text-gray-600 font-semibold uppercase tracking-wider px-4 mt-4 mb-2">Landing Page</p>
        {sectionLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`sidebar-link ${isActive(link.to) ? 'active' : ''}`}
          >
            <link.icon size={18} />
            <span className="text-sm">{link.label}</span>
          </Link>
        ))}

        <p className="text-xs text-gray-600 font-semibold uppercase tracking-wider px-4 mt-4 mb-2">Export</p>
        {exportLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`sidebar-link ${isActive(link.to) ? 'active' : ''}`}
          >
            <link.icon size={18} />
            <span className="text-sm">{link.label}</span>
          </Link>
        ))}
      </nav>

      {/* Bottom */}
      <div className="p-4 border-t border-dark-400">
        <Link to="/" className="sidebar-link mb-1">
          <Package size={18} />
          <span className="text-sm">Lihat Toko</span>
        </Link>
        <button onClick={handleLogout} className="sidebar-link w-full text-left text-red-400 hover:text-red-300">
          <LogOut size={18} />
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </aside>
  )
}

export default AdminSidebar
