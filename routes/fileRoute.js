var express = require('express');
var router = express.Router();
var FileItem = require('../models/fileitem');
//var Seq = require('../models/seq');
var multer = require('multer');
var Ffmpeg = require('fluent-ffmpeg');

var fs = require("fs"); // 파일시스템 접근을 위한 모듈 호출

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'upload')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});
var upload = multer({storage: storage});

// GET ALL BOOKS
router.get('/fileList', function(req,res){
    FileItem.find(function(err, books){
        if(err) return res.status(500).send({error: 'database failure'});
        res.json(books);
    })
});

makeThumbNail = function(file){
    console.log("makeThumbNail");
    console.log("/"+file.filepath);

    Ffmpeg.setFfmpegPath('C:/Users/jcompia/WebstormProjects/mongoose_tutorial/ffmpeg/bin/ffmpeg.exe');
    Ffmpeg.setFfprobePath('C:/Users/jcompia/WebstormProjects/mongoose_tutorial/ffmpeg/bin/ffprobe.exe');
    Ffmpeg("C:/Users/jcompia/WebstormProjects/mongoose_tutorial/"+file.filepath)
        .screenshots({
            timestamps: [30.5, '50%', '01:10.123'],
            filename: 'thumbnail-'+file.filename+'.png',
            folder: 'C:/Users/jcompia/WebstormProjects/mongoose_tutorial/upload/videos/thumbnail/',
            size: '320x240'
        });
}

router.post('/fileUpload', upload.single('file'), (req, res, next) => {
    var fileitem = new FileItem(req.file);
    //var seq = new Seq();
    //seq.insert({"_id":"seq_post", "seq":new NumberLong(1)});
    fileitem.filepath = 'upload/' + req.file.filename;

    //fileitem.filename = req.file.filename()
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

// DELETE BOOK
router.delete('/fileUpload/:file_id', function(req, res){
   console.log("test");
    FileItem.findOne({_id: req.params.file_id}, function(err, fileitem){
        if(err) return res.status(500).json({error: err});
        if(!fileitem) return res.status(404).json({error: 'file not found'});

        fs.unlink(fileitem.filepath, function(){ // fs 모듈을 이용해서 파일 삭제합니다.​
            // 삭제가 완료되면 여기가 실행됩니다.
            FileItem.remove({"_id":req.params.file_id}, function(err){ // MongoDB 에서 파일 정보 삭제하기​
                if(err) res.send(err); // 에러 확인
                res.end("ok"); // 응답
            });
        });
    })

});
module.exports = router;