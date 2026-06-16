import api from '../utils/api'

const reviewService = {
  create: (data) => api.post('/reviews', data),
  getByProduct: (productId) => api.get(`/reviews/product/${productId}`),
  getAll: () => api.get('/reviews'),
  remove: (id) => api.delete(`/reviews/${id}`),
}

export default reviewService
