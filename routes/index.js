var express = require('express');
var router = express.Router();
var Cart = require('../models/cart');

var Product = require('../models/product');

/* GET home page. */
router.get('/', function(req, res, next) {
  Product.find(function(err, docs) {
    res.render('shop/index', {
      products: docs
    });
  });
});

/* GET page for adding a product to the cart. */
router.get('/add-to-cart/:id', function(req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  Product.findById(productId, function(err, product) {
    if (err) return res.redirect('/');
    cart.add(product, productId);
    req.session.cart = cart;
    res.redirect('/');
  });
});

/* GET temp page for emptying the cart. */
router.get('/empty-cart', function(req, res, next) {
  req.session.cart = null;
  res.redirect('/');
});

module.exports = router;
