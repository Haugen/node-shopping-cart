var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var user = new mongoose.Schema({
  email: {type: String, required: true},
  password: {type: String, required: true}
});

user.methods.encryptPassword = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
};

user.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

module.export = mongoose.model('User', user);
