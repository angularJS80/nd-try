const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');


const Template = require('../models/template');


AWS.config.region = 'ap-northeast-2';
AWS.config.accessKeyId = process.env.ACCESS_KEY_ID;
AWS.config.secretAccessKey = process.env.KEY_PASSWORD;
AWS.config.bucket = "";


const s3 = new AWS.S3({ params: { Bucket: process.env.BUCKET_NAME }});


var mimetypes = require("mime-types"); // 파일시스템 접근을 위한 모듈 호출
var mime = require("mime");

var storage = multerS3({
    s3: s3,
    bucket: process.env.BUCKET_NAME,
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
        let newFileName = Date.now() + '-' + file.originalname;
        cb(null, newFileName);
    }
});
/*
storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'upload')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now()+ '.' + mimetypes.extension(file.mimetype) )
    }
});*/

const upload = multer({
    storage: storage
});

const router = express.Router();

router.post('/s3fileUpload', upload.array('fileItems', 30), (req, res) => {

    if(!req.files) {

        res.status(522).json({
            error: 'file undefined',
            code: 0
        });
    }

    const template = new Template({
        templateName: req.body.templateName,
        username: req.body.username
    });

    const mediaFiles = req.files; // 모든 미디어 파일 배열
    const textArr = req.body.sceneTexts; // 모든 씬 텍스트 파일 배열
console.log(req.body)
    mediaFiles.map((file) => {
        let s3Url = `https://s3.ap-northeast-2.amazonaws.com/static-vplate/${Date.now()}-${file.originalname}`;
        template.templateResources.mediaUrl.push(s3Url);
    });

    for(let i=0; i<textArr.length; i++) {
        template.templateResources.texts.push(textArr[i])
    };

    console.log(textArr);

    template.save(err => {
        if(err) {
            return res.status(419).json({
                message : 'db error occured'
            });
        }

        return res.status(200).json({
            success : true,
            template
        });
    });
});

router.get('s3fileUpload', function(req,res){
    Template.find(function(err, textArr){
        if(err) return res.status(500).send({error: 'database failure'});
        res.send(textArr);
    })
});

router.delete('/:template_id', function(req, res){
    Template.remove({ _id: req.params.template_id }, function(err, output){
        if(err) return res.status(500).json({ error: "database failure" });
        res.send('template_id delete success');
        /* ( SINCE DELETE OPERATION IS IDEMPOTENT, NO NEED TO SPECIFY )
         if(!output.result.n) return res.status(404).json({ error: "book not found" });
         res.json({ message: "book deleted" });
         */

        res.status(204).end();
    })
});

module.exports = router;