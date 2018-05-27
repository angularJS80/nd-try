const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');


const Template = require('../models/template');
const Scenes = require('../models/scenes');

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

    let template = new Template();

    const mediaFiles = req.files; // 모든 미디어 파일 배열
    const textArr = req.body.sceneTexts; // 모든 씬 텍스트 파일 배열
    let textIndex = 0;

    // 템플레이트는 여러 씬즈(씬들의 집합) 을 S3 업로드와 클라이언트의 전송된 정보를 받아서 Scenes 에 포함될 Scene 을 파일별로 만들어줘야 한다.
    //Scenes scenes = new Scenes();
    mediaFiles.map((file) => {
        let s3Url = `https://s3.ap-northeast-2.amazonaws.com/static-vplate/${Date.now()}-${file.originalname}`


        console.log(file.mimetypes);



        let ResouceMimeType = "" // 업로드된 파일의 타입을 가져온다
        let resourceTypeNumber;
        
        
        // 1.리소스에 따른 타입처리
        if(ResouceMimeType=='이미지'){
            resourceTypeNumber = 1;
        }
        let resourceText = "";

        // 2.텍스트 배열로 받는데 이 텍스타가 어느 신의 소속인지. 불분명하고.
        if(textArr){
            let resourceText = textArr[textIndex];
        }

        // 3.리소스 자체가 어느 신 소속인지 나눠서 들어가야 됨
        let resource = {resourceType: resourceTypeNumber,	// must be one of those listed in resourceTypes
            text: resourceText,
            url: s3Url}

        // 씬 내부에 리소시즈에는 해당씬에 포함될 파일들을 푸시한다
        // scene.resources.push(resource)

        // 리소시즈가 있는 신을 신즈에 푸시한다
        // scenes.push(scene);

            //template.scenes.resources.push(resource);
        textIndex++;
    });
    // 신즈를 템플릿에 적용한다 
    // template.scenes = scenes;

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