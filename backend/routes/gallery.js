const express = require('express');
const router = express.Router();
const { getGallery, addImage, deleteImage, clearGallery } = require('../controllers/galleryController');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');
const { uploadGallery } = require('../middleware/upload');

router.get('/product/:product_id',         getGallery);
router.post('/product/:product_id',        authMiddleware, adminMiddleware, uploadGallery.single('image'), addImage);
router.delete('/clear/:product_id',        authMiddleware, adminMiddleware, clearGallery);
router.delete('/:id',                      authMiddleware, adminMiddleware, deleteImage);

module.exports = router;
