import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { User, Lock, Save } from 'lucide-react'
import authService from '../../services/authService'
import { useAuth } from '../../hooks/useAuth'
import toast from 'react-hot-toast'

const ProfilePage = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [profileForm, setProfileForm] = useState({ name: '', email: '' })
  const [passwordForm, setPasswordForm] = useState({ old_password: '', new_password: '', confirm: '' })
  const [loading, setLoading] = useState(false)

  if (!user) return <Navigate to="/login" replace />

  useEffect(() => {
    setProfileForm({ name: user.name || '', email: user.email || '' })
  }, [user])

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await authService.updateProfile(profileForm)
      toast.success('Profil berhasil diperbarui')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal update profil')
    }
    setLoading(false)
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    if (passwordForm.new_password !== passwordForm.confirm) {
      toast.error('Konfirmasi password tidak cocok')
      return
    }
    if (passwordForm.new_password.length < 6) {
      toast.error('Password baru minimal 6 karakter')
      return
    }
    setLoading(true)
    try {
      await authService.changePassword({
        old_password: passwordForm.old_password,
        new_password: passwordForm.new_password,
      })
      toast.success('Password berhasil diubah')
      setPasswordForm({ old_password: '', new_password: '', confirm: '' })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal ganti password')
    }
    setLoading(false)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <p className="text-primary text-sm font-semibold mb-1">Akun</p>
        <h1 className="text-3xl font-bold text-white">Pengaturan Profil</h1>
      </div>

      {/* Avatar */}
      <div className="card mb-6 flex items-center gap-4">
        <div className="w-14 h-14 bg-gold-gradient rounded-full flex items-center justify-center">
          <span className="text-xl font-bold text-black">{user.name?.[0]?.toUpperCase()}</span>
        </div>
        <div>
          <p className="font-semibold text-white">{user.name}</p>
          <p className="text-sm text-gray-500">{user.email}</p>
          <span className="text-xs bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full mt-1 inline-block capitalize">
            {user.role}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-dark-300 p-1 rounded-xl mb-6">
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'profile' ? 'bg-dark-100 text-white' : 'text-gray-500 hover:text-gray-300'}`}
        >
          <User size={14} /> Edit Profil
        </button>
        <button
          onClick={() => setActiveTab('password')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'password' ? 'bg-dark-100 text-white' : 'text-gray-500 hover:text-gray-300'}`}
        >
          <Lock size={14} /> Ganti Password
        </button>
      </div>

      {/* Edit Profile */}
      {activeTab === 'profile' && (
        <div className="card">
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div>
              <label className="label">Nama Lengkap</label>
              <input
                type="text"
                className="input-field"
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                className="input-field"
                value={profileForm.email}
                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                required
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
              <Save size={14} /> {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </form>
        </div>
      )}

      {/* Change Password */}
      {activeTab === 'password' && (
        <div className="card">
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="label">Password Lama</label>
              <input
                type="password"
                className="input-field"
                value={passwordForm.old_password}
                onChange={(e) => setPasswordForm({ ...passwordForm, old_password: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="label">Password Baru</label>
              <input
                type="password"
                className="input-field"
                value={passwordForm.new_password}
                onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="label">Konfirmasi Password Baru</label>
              <input
                type="password"
                className="input-field"
                value={passwordForm.confirm}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                required
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
              <Lock size={14} /> {loading ? 'Menyimpan...' : 'Ganti Password'}
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

export default ProfilePage
