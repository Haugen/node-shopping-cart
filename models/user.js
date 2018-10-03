var mongoose = require('mongoose');

var user = new mongoose.Schema({
  email: {type: String, required: true},
  password: {type: String, required: true}
});

modules.export = mongoose.model('User', user);
