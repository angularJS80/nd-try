var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var uploadSchema = new Schema({
    filepath: String,
    filename: String,
    fieldname: String,
    originalname: String,
    encodests: String,
    mimetype: String,
    destination: String,
    size: Number,
    source:String,
    regUserId:String,
    regDate:String,
    uptDate:String,
    token:String,
});

module.exports = mongoose.model('upload', uploadSchema);

