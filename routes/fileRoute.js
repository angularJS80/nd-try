var express = require('express');
var router = express.Router();
var FileItem = require('../models/fileitem');
var multer = require('multer');
var Ffmpeg = require('fluent-ffmpeg');
var path = require('path');
var fs = require("fs"); // 파일시스템 접근을 위한 모듈 호출
var rootPath = path.join(__dirname, "../");
var mimetypes = require("mime-types"); // 파일시스템 접근을 위한 모듈 호출
var mime = require("mime");

let jwt = require('jsonwebtoken');
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'upload')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now()+ '.' + mimetypes.extension(file.mimetype) )
    }
});

var upload = multer({storage: storage});
// GET ALL FILELIST
router.post('/fileList', function(req,res){

    var query = {
        originalname :{
            $regex: new RegExp(req.body.searchString, "ig")
        }
    }

    FileItem.find(query,function(err, books){
        if(err) return res.status(500).send({error: 'database failure'});
        res.json(books);
    })
});

makeThumbNail = function(file){
    // 아래 주석은 윈도우 기반에서 활성화 한다.
    //Ffmpeg.setFfmpegPath(rootPath +"/ffmpeg/bin/ffmpeg.exe");
    //Ffmpeg.setFfprobePath(rootPath +"/ffmpeg/bin/ffprobe.exe");

    Ffmpeg(rootPath+file.filepath)
        .screenshots({
            //timestamps: [30.5, '50%', '01:10.123'],
            timestamps: ['1%'],
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
        // 동영상일때만 썸네일 생성하도록 변경
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















// GET SINGLE BOOK
router.get('/fileCheck/:file_id', function(req, res){

    let token = jwt.sign({
        username: req.params.file_id,
        password: req.params.file_id
    }, global.config.jwt_secret, {
        expiresIn: 5// expires in 1 hour
    }); // 현재 파일에 국한되게만 사용 가능한 토큰 처리

    FileItem.findOne({_id: req.params.file_id}, function(err, fileitem){
        if(err) return res.status(500).json({error: err});
        if(!fileitem) return res.status(404).json({error: 'file not found'});

        fileitem.filepath += "?token="+token;
        fileitem.token = token;
        res.json(fileitem);
    })
});

// GET SINGLE BOOK
router.get('/fileDownload/:file_id', function(req, res){
    FileItem.findOne({_id: req.params.file_id}, function(err, fileitem){
        if(err) return res.status(500).json({error: err});
        if(!fileitem) return res.status(404).json({error: 'file not found'});
        var mimetype = mime.lookup(fileitem.filepath)
        res.setHeader('Content-type',mimetype);


        console.log(fileitem.originalname);
        //res.setHeader('Content-Disposition', 'attachment;filename*=UTF-8\'\''+fileitem.originalname);
        res.setHeader("Content-Disposition", "attachment;filename=" + encodeURI(fileitem.originalname)+".mp4");
        var filestream = fs.createReadStream(fileitem.filepath);
        filestream.pipe(res);
    })
});


module.exports = router;