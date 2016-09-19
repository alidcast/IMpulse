var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');


var userSchema = new mongoose.Schema({
  username: { type: String, unique: true, lowercase: true},
  password: String,
  contacts: []
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);
