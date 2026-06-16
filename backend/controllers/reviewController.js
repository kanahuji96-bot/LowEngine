const { Review, Order, Product, User } = require('../models');

// User: buat review (hanya jika order completed)
const createReview = async (req, res) => {
  try {
    const { product_id, order_id, rating, comment } = req.body;
    if (!product_id || !order_id || !rating) {
      return res.status(400).json({ success: false, message: 'product_id, order_id, rating wajib diisi' });
    }

    const order = await Order.findOne({ where: { id: order_id, user_id: req.user.id, status: 'completed' } });
    if (!order) {
      return res.status(400).json({ success: false, message: 'Order tidak ditemukan atau belum completed' });
    }

    const existing = await Review.findOne({ where: { user_id: req.user.id, product_id, order_id } });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Anda sudah mereview produk ini' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'Rating harus antara 1-5' });
    }

    const review = await Review.create({ user_id: req.user.id, product_id, order_id, rating, comment });
    res.status(201).json({ success: true, message: 'Review berhasil dibuat', data: review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Public: lihat review produk
const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      where: { product_id: req.params.product_id },
      include: [{ model: User, attributes: ['id', 'name'] }],
      order: [['created_at', 'DESC']],
    });
    res.json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: lihat semua review
const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      include: [
        { model: User, attributes: ['id', 'name'] },
        { model: Product, attributes: ['id', 'name', 'slug'] },
      ],
      order: [['created_at', 'DESC']],
    });
    res.json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: hapus review
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findByPk(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Review tidak ditemukan' });
    await review.destroy();
    res.json({ success: true, message: 'Review berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createReview, getProductReviews, getAllReviews, deleteReview };
