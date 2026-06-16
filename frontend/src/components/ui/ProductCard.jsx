import { Link } from 'react-router-dom'
import { ShoppingCart, Star } from 'lucide-react'
import { formatRupiah } from '../../utils/format'
import { useCart } from '../../hooks/useCart'
import toast from 'react-hot-toast'

const ProductCard = ({ product }) => {
  const { addToCart } = useCart()

  const handleAddToCart = (e) => {
    e.preventDefault()
    if (product.stock === 0) {
      toast.error('Stok habis')
      return
    }
    addToCart(product, 1)
    toast.success(`${product.name} ditambahkan ke keranjang`)
  }

  const imageUrl = product.image ? `/uploads/products/${product.image}` : null

  return (
    <Link to={`/products/${product.slug}`} className="group block">
      <div
        className="rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
        style={{
          background: '#0f0f0f',
          border: '1px solid rgba(255,255,255,0.06)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.border = '1px solid rgba(212,175,55,0.35)'
          e.currentTarget.style.boxShadow = '0 0 24px rgba(212,175,55,0.15), 0 8px 30px rgba(0,0,0,0.5)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.border = '1px solid rgba(255,255,255,0.06)'
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.4)'
        }}
      >
        {/* Image */}
        <div className="relative h-48 bg-[#111] overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-5xl opacity-30">📦</span>
            </div>
          )}

          {/* Out of stock overlay */}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
              <span className="text-xs font-bold text-gray-300 bg-black/60 border border-white/10 px-3 py-1 rounded-full uppercase tracking-widest">
                Habis
              </span>
            </div>
          )}

          {/* Category badge */}
          {product.Category && (
            <span className="absolute top-2 left-2 text-[10px] font-bold uppercase tracking-widest bg-black/70 text-[#D4AF37] border border-[#D4AF37]/30 px-2 py-0.5 rounded-full backdrop-blur-sm">
              {product.Category.name}
            </span>
          )}

          {/* Hot badge jika stok < 5 */}
          {product.stock > 0 && product.stock <= 5 && (
            <span className="absolute top-2 right-2 text-[10px] font-bold uppercase tracking-widest bg-red-600/90 text-white px-2 py-0.5 rounded-full">
              Hampir Habis
            </span>
          )}
        </div>

        {/* Info */}
        <div className="p-3.5">
          <h3 className="font-semibold text-white text-sm mb-0.5 line-clamp-2 group-hover:text-[#D4AF37] transition-colors leading-snug">
            {product.name}
          </h3>
          <p className="text-[11px] text-gray-600 mb-2.5">Stok: {product.stock}</p>

          <div className="flex items-center justify-between">
            <span
              className="font-black text-sm"
              style={{ background: 'linear-gradient(90deg,#D4AF37,#F0D060)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
            >
              {formatRupiah(product.price)}
            </span>
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="w-8 h-8 rounded-lg flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 hover:scale-110"
              style={{ background: 'linear-gradient(135deg,#D4AF37,#F0D060)', boxShadow: '0 0 12px rgba(212,175,55,0.3)' }}
            >
              <ShoppingCart size={14} className="text-black" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default ProductCard
