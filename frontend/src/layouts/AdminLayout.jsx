import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import AdminSidebar from '../components/admin/AdminSidebar'

const AdminLayout = () => {
  const { user, isAdmin } = useAuth()

  if (!user) return <Navigate to="/login" replace />
  if (!isAdmin()) return <Navigate to="/" replace />

  return (
    <div className="min-h-screen flex bg-dark">
      <AdminSidebar />
      <main className="flex-1 ml-64 p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout
