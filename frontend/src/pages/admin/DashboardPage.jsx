import { useState, useEffect } from 'react'
import { Users, Tag, Package, ShoppingBag, TrendingUp } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import dashboardService from '../../services/dashboardService'
import { formatRupiah } from '../../utils/format'
import { PageLoader } from '../../components/ui/LoadingSpinner'

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
const PIE_COLORS = ['#D4AF37', '#4361EE', '#2DC653', '#E63946', '#a855f7', '#f97316', '#06b6d4']

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="card flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
      <Icon size={22} />
    </div>
    <div>
      <p className="text-xs text-gray-500 font-medium">{label}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  </div>
)

const DashboardPage = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    dashboardService.getStats()
      .then((r) => setData(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <PageLoader />
  if (!data) return <p className="text-gray-400">Gagal memuat data</p>

  const { stats, orderMonthly, revenueMonthly, orderStatus } = data

  const barData = MONTH_NAMES.map((name, i) => {
    const found = orderMonthly.find((o) => o.month === i + 1)
    return { name, total: found ? Number(found.total) : 0 }
  })

  const pieData = orderStatus.map((s) => ({
    name: s.status,
    value: Number(s.total),
  }))

  return (
    <div>
      <div className="mb-8">
        <p className="text-primary text-sm font-semibold mb-1">Overview</p>
        <h1 className="text-3xl font-bold text-white">Dashboard Admin</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-10">
        <StatCard icon={Users} label="Total User" value={stats.totalUsers} color="bg-blue-500/20 text-blue-400" />
        <StatCard icon={Tag} label="Kategori" value={stats.totalCategories} color="bg-purple-500/20 text-purple-400" />
        <StatCard icon={Package} label="Produk" value={stats.totalProducts} color="bg-green-500/20 text-green-400" />
        <StatCard icon={ShoppingBag} label="Order" value={stats.totalOrders} color="bg-orange-500/20 text-orange-400" />
        <StatCard icon={TrendingUp} label="Pendapatan" value={formatRupiah(stats.totalRevenue)} color="bg-primary/20 text-primary" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart */}
        <div className="lg:col-span-2 card">
          <h2 className="text-base font-semibold text-white mb-6">Order per Bulan</h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={barData}>
              <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid #333', borderRadius: 8, color: '#fff' }}
                cursor={{ fill: 'rgba(212,175,55,0.05)' }}
              />
              <Bar dataKey="total" fill="#D4AF37" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="card">
          <h2 className="text-base font-semibold text-white mb-6">Status Order</h2>
          {pieData.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-10">Belum ada data</p>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3} dataKey="value">
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid #333', borderRadius: 8, color: '#fff' }}
                />
                <Legend formatter={(v) => <span style={{ color: '#9ca3af', fontSize: 11 }}>{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
