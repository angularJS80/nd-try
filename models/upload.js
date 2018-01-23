var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var uploadSchema = new Schema({
    filepath: String
});

module.exports = mongoose.model('upload', uploadSchema);

