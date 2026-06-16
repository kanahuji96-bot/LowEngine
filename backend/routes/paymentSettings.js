const express = require('express');
const router = express.Router();
const { getAll, getActive, create, update, remove } = require('../controllers/paymentSettingController');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');
const { uploadQris } = require('../middleware/upload');

router.get('/',        getAll);
router.get('/active',  getActive);
router.post('/',       authMiddleware, adminMiddleware, uploadQris.single('qr_image'), create);
router.put('/:id',     authMiddleware, adminMiddleware, uploadQris.single('qr_image'), update);
router.delete('/:id',  authMiddleware, adminMiddleware, remove);

module.exports = router;
