import api from '../utils/api'

const paymentService = {
  upload: (orderId, data) =>
    api.post(`/payments/order/${orderId}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getAll: () => api.get('/payments'),
  verify: (id, data) => api.put(`/payments/${id}/verify`, data),
}

export default paymentService
