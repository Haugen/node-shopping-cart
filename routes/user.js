var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');
var User = require('../models/user');
var customGlobals = require('../config/global');

var csrfProtection = csrf();
router.use(csrfProtection);

/* GET profile page. */
router.get('/profile', customGlobals.isLoggedIn, function(req, res, next) {
  let user;

  if (!res.locals.session.user) {
    user = new Promise(function(resolve, reject) {
      User.findById(res.locals.session.passport.user, function(err, user) {
        if (err) reject(err);
        resolve(user);
      })
    })
  } else {
    user = Promise.resolve(res.locals.session.user);
  }

  user.then(function(user) {
    res.render('user/profile', {
      user: user
    });
  }, function(err) {
    res.redirect('/')
  })
})

/* GET logout page. */
router.get('/logout', customGlobals.isLoggedIn, function(req, res, next) {
  req.logout();
  res.redirect('/');
});

/* Adding a custom middleware here. All routes below this will only be available
   to logged out visitors. */
router.use('/', customGlobals.notLoggedIn, function(req, res, next) {
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
