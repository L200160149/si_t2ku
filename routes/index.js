const router = require('express').Router();
const adminController = require('../controllers/adminController');
var bodyParser = require('body-parser')

router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json())
/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/auth')
});
// route login
router.get('/auth', adminController.viewLogin);
router.post('/auth', adminController.authSignin);

module.exports = router;
