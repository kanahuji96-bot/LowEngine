const express = require('express');
const router = express.Router();
const { getAll, getOne, create, update, remove } = require('../controllers/categoryController');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

router.get('/', getAll);
router.get('/:id', getOne);
router.post('/', authMiddleware, adminMiddleware, create);
router.put('/:id', authMiddleware, adminMiddleware, update);
router.delete('/:id', authMiddleware, adminMiddleware, remove);

module.exports = router;
