const express = require('express');
const router = express.Router();
const { getAll, getOne, create, update, remove } = require('../controllers/productController');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');
const { uploadProduct } = require('../middleware/upload');

router.get('/', getAll);
router.get('/:slug', getOne);
router.post('/', authMiddleware, adminMiddleware, uploadProduct.single('image'), create);
router.put('/:id', authMiddleware, adminMiddleware, uploadProduct.single('image'), update);
router.delete('/:id', authMiddleware, adminMiddleware, remove);

module.exports = router;
