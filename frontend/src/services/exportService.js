import api from '../utils/api'

const exportService = {
  exportExcel: () =>
    api.get('/export/excel', { responseType: 'blob' }),
  exportPDF: () =>
    api.get('/export/pdf', { responseType: 'blob' }),
}

export default exportService
