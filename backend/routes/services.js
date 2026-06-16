const express = require('express');
const router = express.Router();
const { getAll, getOne, create, update, remove } = require('../controllers/serviceController');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');
const { uploadService } = require('../middleware/upload');

router.get('/',     getAll);
router.get('/:id',  getOne);
router.post('/',    authMiddleware, adminMiddleware, uploadService.single('image'), create);
router.put('/:id',  authMiddleware, adminMiddleware, uploadService.single('image'), update);
router.delete('/:id', authMiddleware, adminMiddleware, remove);

module.exports = router;
