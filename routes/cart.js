var express = require('express');
var router = express.Router();
var Cart = require('../models/cart');
var customGlobals = require('../config/global');

var Product = require('../models/product');
var Order = require('../models/order');
var stripe = require("stripe")("sk_test_OBsj2xJ039KHTOJ2zaK02D90");

/* GET page for adding a product to the cart.
   The :action parameter will be either "add", "remove" or delete and will call the
   corresponding function on the Cart object. So the only two URL's that should
   be used here are:

   /cart/add/{id}
   /cart/remove/{id}
   /cart/delete/{id}
   */
router.get('/action/:action/:id', function(req, res, next) {
  var productId = req.params.id;
  var action = req.params.action;
  var cart = new Cart(req.session.cart || {});

  Product.findById(productId, function(err, product) {
    if (err) return res.redirect('/');
    cart[action](product, productId);
    req.session.cart = cart;
    res.redirect(req.headers.referer);
  });
});

/* GET page for viewing the cart. */
router.get('/view', customGlobals.isLoggedIn, function(req, res, next) {
  var cart = new Cart(req.session.cart || {});
  res.render('shop/cart', {
    cartItems: cart.generateArray(),
    totalPrice: cart.totalPrice,
    totalPriceStripe: cart.totalPrice * 100
  });
});

/* POST page for checking out. */
router.post('/checkout', customGlobals.isLoggedIn, function(req, res, next) {
  const token = req.body.stripeToken;

  stripe.charges.create({
    amount: req.session.cart.totalPrice * 100,
    currency: 'usd',
    description: 'Example charge',
    source: token,
  }, function(err, charge) {
    if (err) res.redirect('/user/view');
    var order = new Order({
      user: req.user,
      cart: req.session.cart,
      paymentId: charge.id
    });
    order.save(function(err, result) {
      req.session.cart = null;
      res.redirect('/');
    });
  });
});

/* GET temp page for emptying the cart. */
router.get('/empty', function(req, res, next) {
  req.session.cart = null;
  res.redirect('/');
});

module.exports = router;
