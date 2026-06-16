import { Link, useNavigate } from 'react-router-dom'
import { Trash2, ShoppingBag, Plus, Minus } from 'lucide-react'
import { useCart } from '../../hooks/useCart'
import { useAuth } from '../../hooks/useAuth'
import { formatRupiah } from '../../utils/format'
import EmptyState from '../../components/ui/EmptyState'
import toast from 'react-hot-toast'

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleCheckout = () => {
    if (!user) {
      toast.error('Login dulu untuk checkout')
      navigate('/login')
      return
    }
    navigate('/checkout')
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20">
        <EmptyState
          title="Keranjang kosong"
          description="Belum ada produk di keranjang kamu"
          icon={ShoppingBag}
          action={<Link to="/products" className="btn-primary">Mulai Belanja</Link>}
        />
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Keranjang Belanja</h1>
        <button onClick={clearCart} className="text-sm text-red-400 hover:text-red-300 transition-colors">
          Kosongkan
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => {
            const imageUrl = item.image ? `/uploads/products/${item.image}` : null
            return (
              <div key={item.id} className="bg-dark-200 border border-dark-400 rounded-xl p-4 flex gap-4">
                {/* Image */}
                <div className="w-20 h-20 bg-dark-300 rounded-xl overflow-hidden flex-shrink-0">
                  {imageUrl ? (
                    <img src={imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">📦</div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <h3 className="text-white font-semibold text-sm mb-1">{item.name}</h3>
                  <p className="text-primary font-bold">{formatRupiah(item.price)}</p>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center bg-dark-300 border border-dark-500 rounded-lg overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1.5 text-gray-400 hover:text-white hover:bg-dark-400 transition-colors"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-8 text-center text-white text-sm font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1.5 text-gray-400 hover:text-white hover:bg-dark-400 transition-colors"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-400">{formatRupiah(item.price * item.quantity)}</span>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-500 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-dark-200 border border-dark-400 rounded-xl p-6 sticky top-24">
            <h2 className="text-lg font-bold text-white mb-6">Ringkasan</h2>
            <div className="space-y-3 mb-6">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-400 line-clamp-1 flex-1 mr-2">{item.name} x{item.quantity}</span>
                  <span className="text-white flex-shrink-0">{formatRupiah(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-dark-400 pt-4 mb-6">
              <div className="flex justify-between">
                <span className="font-semibold text-white">Total</span>
                <span className="font-bold text-primary text-lg">{formatRupiah(totalPrice)}</span>
              </div>
            </div>
            <button onClick={handleCheckout} className="w-full btn-primary py-3">
              Checkout Sekarang
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPage
