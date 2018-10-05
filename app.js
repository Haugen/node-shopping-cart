var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// Custom requirements.
var sassMiddleware = require('node-sass-middleware');
var expressHandlebars = require('express-handlebars');
var mongoose = require('mongoose');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var validator = require('express-validator');
var MongoStore = require('connect-mongo')(session);

var indexRouter = require('./routes/index');
var userRouter = require('./routes/user');
var cartRouter = require('./routes/cart');

var app = express();

// view engine setup
app.engine('.hbs', expressHandlebars({
  defaultLayout: 'layout',
  extname: '.hbs'
}));
app.set('view engine', '.hbs');

// Mongoose setup.
mongoose.connect('mongodb://localhost:27017/shopping', {
  useNewUrlParser: true
});

// Configuration for using sass.
app.use(sassMiddleware({
  src: path.join(__dirname, 'sass'),
  dest: path.join(__dirname, 'public/stylesheets'),
  debug: true,
  outputStyle: 'compressed',
  prefix: '/stylesheets'
}));

// Sessions settings.
app.use(session({
  secret: 'f4a980d8ddc98f718c187d439fa6cdc8',
  saveUninitialized: false,
  resave: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  cookie: { maxAge: 180 * 60 * 1000 }
}));

// Flash settings. This depends on sessions above.
app.use(flash());

// Passport settings.
app.use(passport.initialize());
app.use(passport.session());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Settings for validator.
app.use(validator());

// Include custom configuration.
require('./config/passport');

app.use(function(req, res, next) {
  res.locals.loggedIn = req.isAuthenticated();
  res.locals.session = req.session;
  next();
});

app.use('/user', userRouter);
app.use('/cart', cartRouter);
app.use('/', indexRouter);

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
