var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var hellowSchema = new Schema({
    hellow: String,
    hellow_id: String
});

module.exports = mongoose.model('hellow', hellowSchema);
