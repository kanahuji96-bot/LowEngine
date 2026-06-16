const express = require('express');
const router = express.Router();
const { getDashboard } = require('../controllers/dashboardController');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

router.get('/', authMiddleware, adminMiddleware, getDashboard);

module.exports = router;
