var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var heroSchema = new Schema({
    name: String,
    id: String
});

module.exports = mongoose.model('hero', heroSchema);
