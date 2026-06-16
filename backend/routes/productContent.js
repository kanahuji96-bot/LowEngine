const express = require('express');
const router = express.Router();
const { getContent, saveContent } = require('../controllers/productContentController');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

router.get('/:product_id',  getContent);
router.post('/:product_id', authMiddleware, adminMiddleware, saveContent);

module.exports = router;
