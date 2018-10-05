var express = require('express');
var router = express.Router();
var Cart = require('../models/cart');

var Product = require('../models/product');

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
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  Product.findById(productId, function(err, product) {
    if (err) return res.redirect('/');
    cart[action](product, productId);
    req.session.cart = cart;
    res.redirect(req.headers.referer);
  });
});

/* GET page for viewing the cart. */
router.get('/view', function(req, res, next) {
  var cart = new Cart(req.session.cart || {});
  res.render('shop/cart', {
    cartItems: cart.generateArray(),
    totalPrice: cart.totalPrice
  });
});

/* GET temp page for emptying the cart. */
router.get('/empty', function(req, res, next) {
  req.session.cart = null;
  res.redirect('/');
});

module.exports = router;
