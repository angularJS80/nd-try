var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var chatSchema = new Schema({
    message: String,
    userid: String,
    published_date: { type: Date, default: Date.now  }
});

module.exports = mongoose.model('chat', chatSchema);
