const router = require('express').Router();
const adminController = require('../controllers/adminController');

// route dashboard
router.get('/dashboard', adminController.viewDashboard);
// route pegawai
router.get('/pegawai', adminController.viewPegawai);

module.exports = router;