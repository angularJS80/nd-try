var express = require('express');
var router = express.Router();
var UploadMongo = require('../models/upload');
var multer = require('multer');

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'upload')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});

var upload = multer({storage: storage});

router.post('/fileUpload', upload.single('uploadfile'), (req, res, next) => {
    console.log(req.file.filename);
    var uploadMongo = new UploadMongo();
    uploadMongo.filepath = 'upload/' + req.file.filename;

    uploadMongo.save(function(err){
        if(err){
            console.error(err);
            res.json({result: 0});
            return;
        }
        res.json({'message': 'File uploaded successfully'});
    });
});
module.exports = router;