const router = require('express').Router();
const adminController = require('../controllers/adminController');

// route dashboard
router.get('/dashboard', adminController.viewDashboard);

module.exports = router;