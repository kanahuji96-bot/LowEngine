import { useState } from 'react'
import { FileSpreadsheet, FileText, Download } from 'lucide-react'
import exportService from '../../services/exportService'
import toast from 'react-hot-toast'

const ExportPage = () => {
  const [loadingExcel, setLoadingExcel] = useState(false)
  const [loadingPDF, setLoadingPDF] = useState(false)

  const handleExportExcel = async () => {
    setLoadingExcel(true)
    try {
      const res = await exportService.exportExcel()
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const a = document.createElement('a')
      a.href = url
      a.download = 'orders.xlsx'
      a.click()
      window.URL.revokeObjectURL(url)
      toast.success('Excel berhasil diunduh')
    } catch {
      toast.error('Gagal export Excel')
    }
    setLoadingExcel(false)
  }

  const handleExportPDF = async () => {
    setLoadingPDF(true)
    try {
      const res = await exportService.exportPDF()
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }))
      const a = document.createElement('a')
      a.href = url
      a.download = 'orders.pdf'
      a.click()
      window.URL.revokeObjectURL(url)
      toast.success('PDF berhasil diunduh')
    } catch {
      toast.error('Gagal export PDF')
    }
    setLoadingPDF(false)
  }

  return (
    <div>
      <div className="mb-8">
        <p className="text-primary text-sm font-semibold mb-1">Tools</p>
        <h1 className="text-3xl font-bold text-white">Export Data</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Excel */}
        <div className="card hover:border-green-500/30 transition-colors group">
          <div className="w-14 h-14 bg-green-500/10 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-green-500/20 transition-colors">
            <FileSpreadsheet size={28} className="text-green-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Export Excel</h2>
          <p className="text-sm text-gray-500 mb-6 leading-relaxed">
            Download data seluruh order dalam format Excel (.xlsx). Berisi kolom Order ID, User, Total, Status, dan Tanggal.
          </p>
          <div className="text-xs text-gray-600 mb-6 space-y-1">
            <p>✓ Format: .xlsx</p>
            <p>✓ Kolom: ID, User, Total, Status, Tanggal</p>
            <p>✓ Semua order tersedia</p>
          </div>
          <button
            onClick={handleExportExcel}
            disabled={loadingExcel}
            className="w-full flex items-center justify-center gap-2 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 hover:border-green-500/40 text-green-400 font-semibold py-3 rounded-xl transition-all"
          >
            <Download size={16} />
            {loadingExcel ? 'Mengunduh...' : 'Download Excel'}
          </button>
        </div>

        {/* PDF */}
        <div className="card hover:border-red-500/30 transition-colors group">
          <div className="w-14 h-14 bg-red-500/10 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-red-500/20 transition-colors">
            <FileText size={28} className="text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Export PDF</h2>
          <p className="text-sm text-gray-500 mb-6 leading-relaxed">
            Download laporan order dalam format PDF. Berisi judul laporan, tabel order, dan tanggal cetak.
          </p>
          <div className="text-xs text-gray-600 mb-6 space-y-1">
            <p>✓ Format: .pdf</p>
            <p>✓ Tampilan: Laporan formal</p>
            <p>✓ Termasuk tanggal cetak</p>
          </div>
          <button
            onClick={handleExportPDF}
            disabled={loadingPDF}
            className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 text-red-400 font-semibold py-3 rounded-xl transition-all"
          >
            <Download size={16} />
            {loadingPDF ? 'Mengunduh...' : 'Download PDF'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ExportPage
