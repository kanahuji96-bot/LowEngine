const { Order, OrderItem, Product, User, Payment, Review, sequelize } = require('../models');

// User: buat order baru
const createOrder = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { items, shipping_address, notes } = req.body;
    if (!items || !items.length || !shipping_address) {
      return res.status(400).json({ success: false, message: 'items dan shipping_address wajib diisi' });
    }

    let total_amount = 0;
    const orderItemsData = [];

    for (const item of items) {
      const product = await Product.findByPk(item.product_id, { transaction: t });
      if (!product || product.status !== 'active') {
        await t.rollback();
        return res.status(400).json({ success: false, message: `Produk ID ${item.product_id} tidak tersedia` });
      }
      if (product.stock < item.quantity) {
        await t.rollback();
        return res.status(400).json({ success: false, message: `Stok ${product.name} tidak mencukupi` });
      }

      const subtotal = product.price * item.quantity;
      total_amount += subtotal;
      orderItemsData.push({ product_id: item.product_id, quantity: item.quantity, price: product.price, subtotal });

      await product.update({ stock: product.stock - item.quantity }, { transaction: t });
    }

    const order = await Order.create({
      user_id: req.user.id,
      total_amount,
      status: 'waiting_payment',
      shipping_address,
      notes,
    }, { transaction: t });

    for (const itemData of orderItemsData) {
      await OrderItem.create({ order_id: order.id, ...itemData }, { transaction: t });
    }

    await t.commit();
    res.status(201).json({ success: true, message: 'Order berhasil dibuat', data: { id: order.id, total_amount, status: order.status } });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ success: false, message: error.message });
  }
};

// User: lihat order milik sendiri
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { user_id: req.user.id },
      include: [
        { model: OrderItem, as: 'items', include: [{ model: Product, attributes: ['id', 'name', 'image', 'slug'] }] },
        { model: Payment },
      ],
      order: [['created_at', 'DESC']],
    });
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// User: lihat detail order
const getOrderDetail = async (req, res) => {
  try {
    const where = { id: req.params.id };
    if (req.user.role !== 'admin') where.user_id = req.user.id;

    const order = await Order.findOne({
      where,
      include: [
        { model: User, attributes: ['id', 'name', 'email'] },
        { model: OrderItem, as: 'items', include: [{ model: Product, attributes: ['id', 'name', 'image', 'price', 'slug'] }] },
        { model: Payment },
      ],
    });
    if (!order) return res.status(404).json({ success: false, message: 'Order tidak ditemukan' });
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: lihat semua order
const getAllOrders = async (req, res) => {
  try {
    const { status } = req.query;
    const where = {};
    if (status) where.status = status;

    const orders = await Order.findAll({
      where,
      include: [
        { model: User, attributes: ['id', 'name', 'email'] },
        { model: Payment },
      ],
      order: [['created_at', 'DESC']],
    });
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: update status order
const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order tidak ditemukan' });
    const { status } = req.body;
    const validStatus = ['pending', 'waiting_payment', 'paid', 'processed', 'shipped', 'completed', 'cancelled'];
    if (!validStatus.includes(status)) {
      return res.status(400).json({ success: false, message: 'Status tidak valid' });
    }
    await order.update({ status });
    res.json({ success: true, message: 'Status order diperbarui', data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createOrder, getMyOrders, getOrderDetail, getAllOrders, updateOrderStatus };
