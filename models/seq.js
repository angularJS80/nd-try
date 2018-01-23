var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var seqSchema = new Schema({
    _id: String,
    seq:Number

});

module.exports = mongoose.model('seq', seqSchema );
