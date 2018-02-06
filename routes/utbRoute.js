var express = require('express');
var router = express.Router();
var multer = require('multer');
var path = require('path');
var fs = require("fs"); // 파일시스템 접근을 위한 모듈 호출
var rootPath = path.join(__dirname, "../");
var mime = require("mime-types"); // 파일시스템 접근을 위한 모듈 호출
const ytdl = require('ytdl-core');




// CREATE BOOK
router.get('/utbupload', function(req, res){
    ytdl('http://www.youtube.com/watch?v=A02s8omM_hI')
        .pipe(fs.createWriteStream(rootPath+'upload/'+'video.mp4'));

});

module.exports = router;