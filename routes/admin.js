const router = require('express').Router();
const adminController = require('../controllers/adminController');
// const { upload, uploadMultiple } = require('../middlewares/multer');
const multer  = require('multer')
const path = require('path')

// upload file
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "public/uploads");
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    },
  });
  
var upload = multer({ storage: storage });

var uploadPegawai = upload.fields([
    { name: 'file_SK' },
    { name: 'foto_ktp' }, 
    { name: 'foto_npwp' },
    { name: 'foto_rek_jateng' },
    { name: 'foto_rek_bni' },
    { name: 'foto_bpjs_kes' },
    { name: 'foto_bpjs_ket' },
])

var uploadGaji = upload.fields([
    { name: 'file' },
])


// route dashboard
router.get('/dashboard', adminController.viewDashboard);
// route pegawai
router.get('/pegawai', adminController.viewPegawai);
router.post('/pegawai', uploadPegawai, adminController.addPegawai);
router.put('/pegawai', uploadPegawai, adminController.editPegawai);
router.delete('/pegawai/:id', adminController.deletePegawai);
// route jabatan
router.get('/jabatan', adminController.viewJabatan);
router.post('/jabatan', adminController.addJabatan);
router.put('/jabatan', adminController.editJabatan);
router.delete('/jabatan/:id', adminController.deleteJabatan);
// route cetakgaji
router.get('/cetakgaji', adminController.cetakGaji);
// route gaji
router.get('/gaji', adminController.viewGaji);
// route pemasukan
router.get('/pemasukan', adminController.viewPemasukan);
router.post('/pemasukan', adminController.addPemasukan);
router.put('/pemasukan', adminController.editPemasukan);
router.delete('/pemasukan/:id', adminController.deletePemasukan);
// route pengeluaran
router.get('/pengeluaran', adminController.viewPengeluaran);
router.post('/pengeluaran', adminController.addPengeluaran);
router.put('/pengeluaran', adminController.editPengeluaran);
router.delete('/pengeluaran/:id', adminController.deletePengeluaran);

module.exports = router;