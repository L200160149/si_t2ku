const router = require('express').Router();
const adminController = require('../controllers/adminController');

// route dashboard
router.get('/dashboard', adminController.viewDashboard);
// route pegawai
router.get('/pegawai', adminController.viewPegawai);
// route sk
router.get('/sk', adminController.viewSk);
// route gaji
router.get('/gaji', adminController.viewGaji);
// route pemasukan
router.get('/pemasukan', adminController.viewPemasukan);
// route pengeluaran
router.get('/pengeluaran', adminController.viewPengeluaran);

module.exports = router;