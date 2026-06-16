const express = require('express');
const router = express.Router();
const { exportExcel, exportPDF } = require('../controllers/exportController');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

router.get('/excel', authMiddleware, adminMiddleware, exportExcel);
router.get('/pdf', authMiddleware, adminMiddleware, exportPDF);

module.exports = router;
