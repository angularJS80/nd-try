var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const scene = require('./scene');

var templateSchema = new Schema({
	name: String,
	scenes: [scene.schema],	// mongoose subdocument
	owner: mongoose.Schema.Types.ObjectId,
	deleted: Boolean	// initially false
});

module.exports = mongoose.model('template', templateSchema);
