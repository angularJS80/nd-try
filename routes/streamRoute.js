var express = require('express');
var router = express.Router();
var vidStreamer = require('vid-streamer');
var settings = require('../vidstream.json');

var path = require('path');
var rootPath = path.join(__dirname, "../");
settings.rootFolder = rootPath + "upload/";
// GET ALL BOOKSx
router.use('/videos/upload', vidStreamer.settings(settings));
module.exports = router;