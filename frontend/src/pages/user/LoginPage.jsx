import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import TopNav from '../../components/ui/TopNav'
import GlobalFooter from '../../components/ui/GlobalFooter'
import toast from 'react-hot-toast'

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const user = await login(form.email, form.password)
      toast.success(`Selamat datang, ${user.name}!`)
      navigate(user.role === 'admin' ? '/admin' : '/')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login gagal')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen" style={{ background: '#0A0A0A', paddingTop: 56 }}>
      <TopNav />
      <div className="flex items-center justify-center min-h-[calc(100vh-56px)] px-4">
        <div className="relative w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white">Masuk ke LowEngine</h1>
            <p className="text-gray-500 text-sm mt-1">Selamat datang kembali!</p>
          </div>

          <div className="card">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="label">Email</label>
                <input type="email" value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="input-field" placeholder="contoh@email.com" required />
              </div>
              <div>
                <label className="label">Password</label>
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    className="input-field pr-10" placeholder="••••••••" required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading} className="w-full btn-primary py-3 text-base">
                {loading ? 'Masuk...' : 'Masuk'}
              </button>
            </form>
            <p className="text-center text-sm text-gray-500 mt-6">
              Belum punya akun?{' '}
              <Link to="/register" className="text-primary hover:text-primary-light font-medium">Daftar sekarang</Link>
            </p>
            <div className="mt-6 p-4 bg-dark-300 rounded-xl border border-dark-500">
              <p className="text-xs text-gray-500 mb-2 font-semibold">Akun Demo:</p>
              <p className="text-xs text-gray-400">Admin: admin@gmail.com / password</p>
              <p className="text-xs text-gray-400">User: user@gmail.com / password</p>
            </div>
          </div>
        </div>
      </div>
      <GlobalFooter />
    </div>
  )
}

export default LoginPage
