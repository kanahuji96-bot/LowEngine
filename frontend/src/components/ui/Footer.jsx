import { Link } from 'react-router-dom'
import { Package, Instagram, Twitter, Facebook } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-dark-100 border-t border-dark-400 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl font-black italic tracking-wide gold-text">LowEngine</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              Belanja mudah, aman, dan terpercaya. Temukan ribuan produk berkualitas dengan harga terbaik.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a href="#" className="w-8 h-8 bg-dark-300 hover:bg-dark-400 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-colors">
                <Instagram size={15} />
              </a>
              <a href="#" className="w-8 h-8 bg-dark-300 hover:bg-dark-400 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-colors">
                <Twitter size={15} />
              </a>
              <a href="#" className="w-8 h-8 bg-dark-300 hover:bg-dark-400 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-colors">
                <Facebook size={15} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Navigasi</h4>
            <ul className="space-y-2">
              {[
                { label: 'Home', to: '/' },
                { label: 'Produk', to: '/products' },
                { label: 'Keranjang', to: '/cart' },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-gray-500 hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Akun</h4>
            <ul className="space-y-2">
              {[
                { label: 'Login', to: '/login' },
                { label: 'Daftar', to: '/register' },
                { label: 'Pesanan Saya', to: '/orders' },
                { label: 'Profil', to: '/profile' },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-gray-500 hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-dark-400 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-gray-600">© 2024 LowEngine. All rights reserved.</p>
          <p className="text-xs text-gray-600">Dibuat untuk PKL — Fullstack E-Commerce</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
