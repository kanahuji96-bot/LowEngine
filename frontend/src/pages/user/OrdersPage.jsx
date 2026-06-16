import { useState, useEffect } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { ShoppingBag, ChevronRight } from 'lucide-react'
import orderService from '../../services/orderService'
import { useAuth } from '../../hooks/useAuth'
import { formatRupiah, formatDate } from '../../utils/format'
import StatusBadge from '../../components/ui/StatusBadge'
import EmptyState from '../../components/ui/EmptyState'
import { PageLoader } from '../../components/ui/LoadingSpinner'

const OrdersPage = () => {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  if (!user) return <Navigate to="/login" replace />

  useEffect(() => {
    orderService.getMyOrders()
      .then((r) => setOrders(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <PageLoader />

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <p className="text-primary text-sm font-semibold mb-1">Akun</p>
        <h1 className="text-3xl font-bold text-white">Pesanan Saya</h1>
      </div>

      {orders.length === 0 ? (
        <EmptyState
          title="Belum ada pesanan"
          description="Mulai belanja dan pesanan akan muncul di sini"
          icon={ShoppingBag}
          action={<Link to="/products" className="btn-primary">Mulai Belanja</Link>}
        />
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link key={order.id} to={`/orders/${order.id}`} className="block">
              <div className="bg-dark-200 border border-dark-400 hover:border-primary/30 rounded-xl p-5 transition-all duration-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-white">Order #{order.id}</span>
                    <StatusBadge status={order.status} />
                  </div>
                  <ChevronRight size={16} className="text-gray-500" />
                </div>
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span>{formatDate(order.created_at)}</span>
                  <span className="text-primary font-bold">{formatRupiah(order.total_amount)}</span>
                </div>
                {order.items?.length > 0 && (
                  <p className="text-xs text-gray-500 mt-2">
                    {order.items.length} produk
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default OrdersPage
