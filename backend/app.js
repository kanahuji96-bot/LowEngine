const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { sequelize } = require('./models');

const app = express();

// Middleware global
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files untuk upload
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads/services', express.static(path.join(__dirname, 'uploads/services')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/export', require('./routes/export'));
app.use('/api/services', require('./routes/services'));
app.use('/api/gallery', require('./routes/gallery'));
app.use('/api/product-content', require('./routes/productContent'));
app.use('/api/payment-settings', require('./routes/paymentSettings'));

// Health check
app.get('/api', (req, res) => {
  res.json({ success: true, message: 'Toko Jualan API berjalan' });
});

// Sync database dan jalankan server
const PORT = process.env.PORT || 5000;

sequelize.sync({ alter: false }).then(() => {
  console.log('Database tersambung');
  app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error('Gagal connect database:', err.message);
});
