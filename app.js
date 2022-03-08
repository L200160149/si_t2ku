var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const methodOverride = require('method-override');
// untuk notifikasi
const session = require('express-session');
const flash = require('connect-flash');
// import mongoose
const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://l200160149:l200160149@cluster0.m7nma.mongodb.net/db_t2ku_bmck?retryWrites=true&w=majority");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

// admin router
const adminRouter = require("./routes/admin");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// method override
app.use(methodOverride("_method"));
// untuk notifikasi
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }
}))
app.use(flash());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
app.use('/public', express.static(__dirname + "/public"));
// load template admin
app.use(
  "/admin-lte",
  express.static(path.join(__dirname, "node_modules/admin-lte"))
);

app.use('/', indexRouter);
app.use('/users', usersRouter);
// admin
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
