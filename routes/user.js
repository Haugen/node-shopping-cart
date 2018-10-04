var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');
var User = require('../models/user');

var csrfProtection = csrf();
router.use(csrfProtection);

/* GET profile page. */
router.get('/profile', isLoggedIn, function(req, res, next) {
  console.log(res.locals.session);
  res.render('user/profile');
})

/* GET logout page. */
router.get('/logout', isLoggedIn, function(req, res, next) {
  req.logout();
  res.redirect('/');
});

/* Adding a custom middleware here. All routes below this will only be available
   to logged out visitors. */
router.use('/', notLoggedIn, function(req, res, next) {
  next();
});

/* GET user signup page. */
router.get('/signup', function(req, res, next) {
  var messages = req.flash('error');
  res.render('user/signup', {
    csrfToken: req.csrfToken(),
    messages: messages,
    hasErrors: messages.length > 0 ? true : false,
  });
});

/* POST user signup page. */
router.post('/signup', passport.authenticate('local.signup', {
  successRedirect: '/user/profile',
  failureRedirect: '/user/signup',
  failureFlash: true
}));

/* GET user sign in page. */
router.get('/login', function(req, res, next) {
  var messages = req.flash('error');
  res.render('user/login', {
    csrfToken: req.csrfToken(),
    messages: messages,
    hasErrors: messages.length > 0 ? true : false,
  });
})

/* POST user sign in page. */
router.post('/login', passport.authenticate('local.login', {
  successRedirect: '/user/profile',
  failureRedirect: '/user/login',
  failureFlash: true
}));

module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/');
}

function notLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) return next();
  res.redirect('/');
}
