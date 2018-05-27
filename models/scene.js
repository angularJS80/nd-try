const mongoose = require('mongoose');

const ResourceTypes = {
	TEXT: 0,
	IMAGE: 1,
	VIDEO: 2
};

var sceneSchema = new mongoose.Schema({
	name: String,
	resources: [{
		// this is called a "tagged union" (or a "sum type"). The 'resourceType' property
		// is a "tag", which says which of the following properties will exist
		resourceType: Number,	// must be one of those listed in resourceTypes
		text: String,
		url: String
	}]
});

// validating that the scenes resources are all set correctly
sceneSchema.pre('validate', (next) => {
	for (var r in this.resources) {
		var resource = this.resources[r];
		switch (resource.resourceType) {
		case ResourceTypes.TEXT:
			if (!text in resource || url in resource) {
				next(new Error('TEXT resource must have text but no url'));
			}
			break;
		case ResourceTypes.IMAGE:
		case ResourceTypes.VIDEO:
			if (text in resource || !url in resource) {
				next(new Error('IMAGE or VIDEO resource must have url but no text'));
			}
			break;
		default:
			next(new Error('Resource must be one of TEXT, IMAGE or VIDEO'));
		}
	}
	next();
});

module.exports = {
	schema: sceneSchema,
	model: mongoose.model('Scene', sceneSchema),
	ResourceTypes: ResourceTypes
};
