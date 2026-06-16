const express = require('express');
const router = express.Router();
const { uploadPayment, getAllPayments, verifyPayment } = require('../controllers/paymentController');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');
const { uploadPayment: uploadMiddleware } = require('../middleware/upload');

router.post('/order/:order_id', authMiddleware, uploadMiddleware.single('payment_proof'), uploadPayment);
router.get('/', authMiddleware, adminMiddleware, getAllPayments);
router.put('/:id/verify', authMiddleware, adminMiddleware, verifyPayment);

module.exports = router;
