export const formatRupiah = (amount) => {
  if (!amount) return 'Rp 0'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)
}

export const formatDate = (date) => {
  if (!date) return '-'
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))
}

export const formatDateShort = (date) => {
  if (!date) return '-'
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date))
}

export const getImageUrl = (path) => {
  if (!path) return null
  if (path.startsWith('http')) return path
  return `/uploads/${path}`
}

export const getStatusColor = (status) => {
  const map = {
    pending: 'bg-yellow-500/20 text-yellow-400',
    waiting_payment: 'bg-orange-500/20 text-orange-400',
    paid: 'bg-blue-500/20 text-blue-400',
    processed: 'bg-purple-500/20 text-purple-400',
    shipped: 'bg-cyan-500/20 text-cyan-400',
    completed: 'bg-green-500/20 text-green-400',
    cancelled: 'bg-red-500/20 text-red-400',
    verified: 'bg-green-500/20 text-green-400',
    rejected: 'bg-red-500/20 text-red-400',
    active: 'bg-green-500/20 text-green-400',
    inactive: 'bg-gray-500/20 text-gray-400',
  }
  return map[status] || 'bg-gray-500/20 text-gray-400'
}

export const getStatusLabel = (status) => {
  const map = {
    pending: 'Pending',
    waiting_payment: 'Menunggu Bayar',
    paid: 'Sudah Bayar',
    processed: 'Diproses',
    shipped: 'Dikirim',
    completed: 'Selesai',
    cancelled: 'Dibatalkan',
    verified: 'Terverifikasi',
    rejected: 'Ditolak',
    active: 'Aktif',
    inactive: 'Nonaktif',
    transfer: 'Transfer Bank',
    ewallet: 'E-Wallet',
    cash: 'Cash',
  }
  return map[status] || status
}
