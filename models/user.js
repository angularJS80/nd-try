var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var UserSchema = new Schema({
    userId: String,
    userPw: String,
    userContry : String,
    token: String,
});

module.exports = mongoose.model('user',UserSchema);