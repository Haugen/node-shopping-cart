var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var order = new Schema({
  user: {type: Schema.Types.ObjectId, ref: "User"},
  cart: {type: Object, required: true},
  paymentId: {type: String, required: true}
});

module.exports = mongoose.model('Order', order);
