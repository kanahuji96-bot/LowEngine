const { Payment, Order, sequelize } = require('../models');

// User: upload bukti pembayaran
const uploadPayment = async (req, res) => {
  try {
    const order = await Order.findOne({ where: { id: req.params.order_id, user_id: req.user.id } });
    if (!order) return res.status(404).json({ success: false, message: 'Order tidak ditemukan' });
    if (order.status !== 'waiting_payment') {
      return res.status(400).json({ success: false, message: 'Order tidak dalam status waiting_payment' });
    }

    const { payment_method, amount } = req.body;
    if (!payment_method || !amount) {
      return res.status(400).json({ success: false, message: 'payment_method dan amount wajib diisi' });
    }

    const existing = await Payment.findOne({ where: { order_id: order.id } });
    if (existing) {
      await existing.update({
        payment_proof: req.file ? req.file.filename : existing.payment_proof,
        payment_method,
        amount,
        status: 'pending',
        paid_at: new Date(),
      });
      return res.json({ success: true, message: 'Bukti pembayaran diperbarui', data: existing });
    }

    const payment = await Payment.create({
      order_id: order.id,
      payment_proof: req.file ? req.file.filename : null,
      payment_method,
      amount,
      status: 'pending',
      paid_at: new Date(),
    });

    res.status(201).json({ success: true, message: 'Bukti pembayaran berhasil diupload', data: payment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: lihat semua payment
const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.findAll({
      include: [{ model: Order, include: [{ model: require('../models').User, attributes: ['id', 'name', 'email'] }] }],
      order: [['created_at', 'DESC']],
    });
    res.json({ success: true, data: payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: verifikasi payment
const verifyPayment = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const payment = await Payment.findByPk(req.params.id, { transaction: t });
    if (!payment) {
      await t.rollback();
      return res.status(404).json({ success: false, message: 'Payment tidak ditemukan' });
    }

    const { status, notes } = req.body;
    if (!['verified', 'rejected'].includes(status)) {
      await t.rollback();
      return res.status(400).json({ success: false, message: 'Status harus verified atau rejected' });
    }

    await payment.update({ status, notes }, { transaction: t });

    const order = await Order.findByPk(payment.order_id, { transaction: t });
    if (status === 'verified') {
      await order.update({ status: 'paid' }, { transaction: t });
    } else {
      await order.update({ status: 'waiting_payment' }, { transaction: t });
    }

    await t.commit();
    res.json({ success: true, message: `Payment berhasil ${status}`, data: payment });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { uploadPayment, getAllPayments, verifyPayment };
