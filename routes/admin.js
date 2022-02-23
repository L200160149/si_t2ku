const router = require('express').Router();
const adminController = require('../controllers/adminController');
const { upload, uploadMultiple } = require('../middlewares/multer');

// route dashboard
router.get('/dashboard', adminController.viewDashboard);
// route pegawai
router.get('/pegawai', adminController.viewPegawai);
router.post('/pegawai', upload, adminController.addPegawai);
router.put('/pegawai', adminController.editPegawai);
router.delete('/pegawai/:id', adminController.deletePegawai);
// route gaji
router.get('/gaji', adminController.viewGaji);
// route pemasukan
router.get('/pemasukan', adminController.viewPemasukan);
// route pengeluaran
router.get('/pengeluaran', adminController.viewPengeluaran);

module.exports = router;