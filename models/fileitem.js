var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var uploadSchema = new Schema({
    filepath: String,
    filename: String,
    fieldname: String,
    originalname: String,
    encoding: String,
    mimetype: String,
    destination: String,
    size: Number
});

module.exports = mongoose.model('upload', uploadSchema);

