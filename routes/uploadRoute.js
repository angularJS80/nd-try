var express = require('express');
var router = express.Router();
var UploadMongo = require('../models/upload');
//var Seq = require('../models/seq');
var multer = require('multer');
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



router.post('/fileUpload', upload.single('file'), (req, res, next) => {
    console.log(req.file.filename);
    var uploadMongo = new UploadMongo();
    //var seq = new Seq();
    //seq.insert({"_id":"seq_post", "seq":new NumberLong(1)});

    uploadMongo.filepath = 'upload/' + req.file.filename;
    uploadMongo.save(function(err,result){
        if(err){
            console.error(err);
            res.json({result: 0});
            return;
        }
        console.log(result);
        res.json(result);
    });
});



// DELETE BOOK
router.delete('/fileUpload/:file_id', function(req, res){
   console.log("test");
    UploadMongo.findOne({_id: req.params.file_id}, function(err, fileitem){
        if(err) return res.status(500).json({error: err});
        if(!fileitem) return res.status(404).json({error: 'file not found'});

        fs.unlink(fileitem.filepath, function(){ // fs 모듈을 이용해서 파일 삭제합니다.​
            // 삭제가 완료되면 여기가 실행됩니다.
            UploadMongo.remove({"_id":req.params.file_id}, function(err){ // MongoDB 에서 파일 정보 삭제하기​
                if(err) res.send(err); // 에러 확인
                res.end("ok"); // 응답
            });
        });
    })

});



module.exports = router;