import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import TopNav from '../../components/ui/TopNav'
import GlobalFooter from '../../components/ui/GlobalFooter'
import toast from 'react-hot-toast'

const RegisterPage = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password.length < 6) { toast.error('Password minimal 6 karakter'); return }
    setLoading(true)
    try {
      await register(form.name, form.email, form.password)
      toast.success('Registrasi berhasil!')
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registrasi gagal')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen" style={{ background: '#0A0A0A', paddingTop: 56 }}>
      <TopNav />
      <div className="flex items-center justify-center min-h-[calc(100vh-56px)] px-4">
        <div className="relative w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white">Buat Akun Baru</h1>
            <p className="text-gray-500 text-sm mt-1">Daftar gratis dan mulai berbelanja</p>
          </div>
          <div className="card">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="label">Nama Lengkap</label>
                <input type="text" value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="input-field" placeholder="Nama kamu" required />
              </div>
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
                    className="input-field pr-10" placeholder="Minimal 6 karakter" required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading} className="w-full btn-primary py-3 text-base">
                {loading ? 'Mendaftar...' : 'Daftar Sekarang'}
              </button>
            </form>
            <p className="text-center text-sm text-gray-500 mt-6">
              Sudah punya akun?{' '}
              <Link to="/login" className="text-primary hover:text-primary-light font-medium">Masuk di sini</Link>
            </p>
          </div>
        </div>
      </div>
      <GlobalFooter />
    </div>
  )
}

export default RegisterPage
