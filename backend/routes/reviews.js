const express = require('express');
const router = express.Router();
const { createReview, getProductReviews, getAllReviews, deleteReview } = require('../controllers/reviewController');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

router.post('/', authMiddleware, createReview);
router.get('/product/:product_id', getProductReviews);
router.get('/', authMiddleware, adminMiddleware, getAllReviews);
router.delete('/:id', authMiddleware, adminMiddleware, deleteReview);

module.exports = router;
