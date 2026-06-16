import api from '../utils/api'

const dashboardService = {
  getStats: () => api.get('/dashboard'),
}

export default dashboardService
