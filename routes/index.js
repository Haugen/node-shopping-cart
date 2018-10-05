var express = require('express');
var router = express.Router();

var Product = require('../models/product');

/* GET home page. */
router.get('/', function(req, res, next) {
  Product.find(function(err, docs) {
    console.log(req.session.cart);
    res.render('shop/index', {
      products: docs
    });
  });
});

module.exports = router;
