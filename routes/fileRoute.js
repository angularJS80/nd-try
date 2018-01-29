var express = require('express');
var router = express.Router();
var FileItem = require('../models/fileitem');
var multer = require('multer');
var Ffmpeg = require('fluent-ffmpeg');
var path = require('path');
var fs = require("fs"); // 파일시스템 접근을 위한 모듈 호출
var rootPath = path.join(__dirname, "../");
var mime = require("mime-types"); // 파일시스템 접근을 위한 모듈 호출

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'upload')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now()+ '.' + mime.extension(file.mimetype) )
    }
});

var upload = multer({storage: storage});
// GET ALL FILELIST
router.get('/fileList', function(req,res){
    FileItem.find(function(err, books){
        if(err) return res.status(500).send({error: 'database failure'});
        res.json(books);
    })
});

makeThumbNail = function(file){
    //Ffmpeg.setFfmpegPath(rootPath +"/ffmpeg/bin/ffmpeg.exe");
    //Ffmpeg.setFfprobePath(rootPath +"/ffmpeg/bin/ffprobe.exe");
    //Ffmpeg.setFfmpegPath(rootPath +"ffmpeg/ffmpeg");
    //Ffmpeg.setFfprobePath(rootPath +"ffmpeg/ffprobe");


    Ffmpeg(rootPath+file.filepath)
        .screenshots({
            timestamps: [30.5, '50%', '01:10.123'],
            filename: file.filename+'.png',
            folder: rootPath+'/upload/videos/thumbnail/',
            size: '320x240'
        });
}
// UPLOAD FILE
router.post('/fileUpload', upload.single('file'), (req, res, next) => {
    var fileitem = new FileItem(req.file);
    fileitem.filepath = 'upload/' + req.file.filename;
    fileitem.save(function(err,result){
        if(err){
            console.error(err);
            res.json({result: 0});
            return;
        }
        makeThumbNail(result);
        res.json(result);
    });
});

// DELETE FILE
router.delete('/fileUpload/:file_id', function(req, res){
    FileItem.findOne({_id: req.params.file_id}, function(err, fileitem){
        if(err) return res.status(500).json({error: err});
        if(!fileitem) return res.status(404).json({error: 'file not found'});

        fs.unlink(fileitem.filepath, function(){ // fs 모듈을 이용해서 파일 삭제합니다.​
            // 삭제가 완료되면 여기가 실행됩니다.
            FileItem.remove({"_id":req.params.file_id}, function(err){ // MongoDB 에서 파일 정보 삭제하기​
                if(err) res.send(err); // 에러 확인
                res.json(req.params.file_id);// 응답

            });
        });
    })
});
module.exports = router;