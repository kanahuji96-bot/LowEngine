const { User, Category, Product, Order, Payment, sequelize } = require('../models');
const { QueryTypes } = require('sequelize');

const getDashboard = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalCategories = await Category.count();
    const totalProducts = await Product.count();
    const totalOrders = await Order.count();

    // Total pendapatan dari payment verified
    const revenueResult = await Payment.sum('amount', { where: { status: 'verified' } });
    const totalRevenue = revenueResult || 0;

    // Order per bulan (12 bulan terakhir)
    const orderMonthly = await sequelize.query(
      `SELECT MONTH(created_at) as month, YEAR(created_at) as year, COUNT(*) as total
       FROM orders
       WHERE created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
       GROUP BY YEAR(created_at), MONTH(created_at)
       ORDER BY year, month`,
      { type: QueryTypes.SELECT }
    );

    // Pendapatan per bulan
    const revenueMonthly = await sequelize.query(
      `SELECT MONTH(created_at) as month, YEAR(created_at) as year, SUM(amount) as total
       FROM payments
       WHERE status = 'verified' AND created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
       GROUP BY YEAR(created_at), MONTH(created_at)
       ORDER BY year, month`,
      { type: QueryTypes.SELECT }
    );

    // Status order distribution
    const orderStatus = await sequelize.query(
      `SELECT status, COUNT(*) as total FROM orders GROUP BY status`,
      { type: QueryTypes.SELECT }
    );

    res.json({
      success: true,
      data: {
        stats: {
          totalUsers,
          totalCategories,
          totalProducts,
          totalOrders,
          totalRevenue,
        },
        orderMonthly,
        revenueMonthly,
        orderStatus,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getDashboard };
