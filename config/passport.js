var passport = require('passport');
var User = require('../models/user');
var LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use('local.login', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, function(req, email, password, done) {
  req.checkBody('email', 'Please enter your email.').notEmpty();
  req.checkBody('password', 'Please enter your password.').notEmpty();
  var errors = req.validationErrors();

  if (errors) {
    let messages = [];
    errors.forEach(function(error) {
      messages.push(error);
    });
    return done(null, false, req.flash('error', messages));
  }

  User.findOne({'email': email}, function(err, user) {
    if (err) return done(err);
    if (!user) return done(null, false, {message: 'Email address not found.'});
    if (!user.validPassword(req.body.password)) return done(null, false, {message: 'Incorrect password.'});

    done(null, user);
  });
}));

passport.use('local.signup', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, function(req, email, password, done) {
  req.checkBody('email', 'Invalid email.').notEmpty().isEmail();
  req.checkBody('password', 'Password too short.').isLength({min: 3});
  req.checkBody('password', 'Password doesn\'t match.').equals(req.body.confirmPassword);
  req.checkBody('terms', 'You need to agree to the terms and conditions.').equals('on');
  var errors = req.validationErrors();

  if (errors) {
    var messages = [];
    errors.forEach(function(error) {
      messages.push(error.msg);
    });
    return done(null, false, req.flash('error', messages));
  }

  User.findOne({'email': email}, function(err, user) {
    if (err) return done(err);
    if (user) return done(null, false, {message: 'Email already in use.'});

    var newUser = new User();
    newUser.email = email;
    newUser.password = newUser.encryptPassword(password);
    newUser.save(function(err, result) {
      if (err) return done(err);
      return done(null, newUser);
    })
  });
}));
