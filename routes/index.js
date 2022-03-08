var express = require('express');
const router = require('express').Router();
const adminController = require('../controllers/adminController');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
// route login
router.get('/login', adminController.viewLogin);

module.exports = router;
