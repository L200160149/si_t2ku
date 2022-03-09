const router = require('express').Router();
const adminController = require('../controllers/adminController');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/auth')
});
// route login
router.get('/auth', adminController.viewLogin);
router.post('/auth', adminController.authSignin);

module.exports = router;
