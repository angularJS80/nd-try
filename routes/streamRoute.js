var express = require('express');
var router = express.Router();
var vidStreamer = require('vid-streamer');
var settings = require('../vidstream.json');


// GET ALL BOOKSx
router.use('/videos', vidStreamer.settings(settings));
module.exports = router;