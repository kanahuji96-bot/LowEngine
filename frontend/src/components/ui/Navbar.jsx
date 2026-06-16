import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, User, Menu, X, LogOut, Package, ChevronDown } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { useCart } from '../../hooks/useCart'

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth()
  const { totalItems } = useCart()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <nav className="sticky top-0 z-50 bg-dark-100 border-b border-dark-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gold-gradient rounded-lg flex items-center justify-center">
              <Package size={18} className="text-black" />
            </div>
            <span className="text-xl font-bold gold-text">LowEngine</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">Home</Link>
            <Link to="/products" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">Produk</Link>
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Cart */}
            <Link to="/cart" className="relative p-2 text-gray-400 hover:text-white transition-colors">
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-black text-xs font-bold rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 bg-dark-300 hover:bg-dark-400 border border-dark-500 px-3 py-2 rounded-lg transition-colors"
                >
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-black">{user.name?.[0]?.toUpperCase()}</span>
                  </div>
                  <span className="text-sm text-white">{user.name}</span>
                  <ChevronDown size={14} className="text-gray-400" />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-dark-200 border border-dark-400 rounded-xl shadow-card overflow-hidden">
                    {isAdmin() && (
                      <Link
                        to="/admin"
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:bg-dark-400 hover:text-white transition-colors"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Admin Panel
                      </Link>
                    )}
                    <Link
                      to="/orders"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:bg-dark-400 hover:text-white transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <Package size={14} /> Pesanan Saya
                    </Link>
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:bg-dark-400 hover:text-white transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <User size={14} /> Profil
                    </Link>
                    <hr className="border-dark-400" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-400 hover:bg-dark-400 transition-colors"
                    >
                      <LogOut size={14} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="text-sm text-gray-400 hover:text-white transition-colors px-3 py-2">Login</Link>
                <Link to="/register" className="btn-primary text-sm px-4 py-2">Daftar</Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden text-gray-400 hover:text-white" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-dark-200 border-t border-dark-400 px-4 py-4 space-y-2">
          <Link to="/" className="block py-2 text-gray-300 hover:text-white" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/products" className="block py-2 text-gray-300 hover:text-white" onClick={() => setMenuOpen(false)}>Produk</Link>
          <Link to="/cart" className="block py-2 text-gray-300 hover:text-white" onClick={() => setMenuOpen(false)}>Keranjang ({totalItems})</Link>
          {user ? (
            <>
              <Link to="/orders" className="block py-2 text-gray-300 hover:text-white" onClick={() => setMenuOpen(false)}>Pesanan Saya</Link>
              <Link to="/profile" className="block py-2 text-gray-300 hover:text-white" onClick={() => setMenuOpen(false)}>Profil</Link>
              {isAdmin() && <Link to="/admin" className="block py-2 text-primary" onClick={() => setMenuOpen(false)}>Admin Panel</Link>}
              <button onClick={handleLogout} className="block w-full text-left py-2 text-red-400">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="block py-2 text-gray-300 hover:text-white" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" className="block py-2 text-primary" onClick={() => setMenuOpen(false)}>Daftar</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}

export default Navbar
