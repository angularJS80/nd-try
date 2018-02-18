
var express = require('express');
var router = express.Router();
var multer = require('multer');
var Ffmpeg = require('fluent-ffmpeg');
var path = require('path');
var fs = require("fs"); // 파일시스템 접근을 위한 모듈 호출
var rootPath = path.join(__dirname, "../");
var mime = require("mime-types"); // 파일시스템 접근을 위한 모듈 호출
const ytdl = require('ytdl-core');
var FileItem = require('../models/fileitem');

module.exports = function(io) {



// GET BOOK BY AUTHOR
router.get('/createFileId', function(req, res){

    var fileitem = new FileItem();
    fileitem.save(function(err,result){

        if(err){
            console.log("createFileId");
            console.error(err);
            res.json({result: 0});
            return;
        }
        res.json(result);
    });
});

makeThumbNail = function(file){
    // 아래 주석은 윈도우 기반에서 활성화 한다.
    //Ffmpeg.setFfmpegPath(rootPath +"/ffmpeg/bin/ffmpeg.exe");
    //Ffmpeg.setFfprobePath(rootPath +"/ffmpeg/bin/ffprobe.exe");
console.log("makeThumnail");
    Ffmpeg(rootPath+file.filepath)
        .screenshots({
            //timestamps: [30.5, '50%', '01:10.123'],
            timestamps: ['1%'],
            filename: file.filename+'.png',
            folder: rootPath+'/upload/videos/thumbnail/',
            size: '320x240'
        });

}

makeEncodeVideo = function(file){
    console.log(file.filepath)
    file.filename = file.id +".avi"
    var command =  Ffmpeg(rootPath+file.filepath)
        .videoCodec('libxvid')
        //.videoCodec('libx264')

        //    .format('mp4');
        .format('avi');

    http://localhost:38080/api/upload/encode-xvid-640_480/5a7ed772d5960c028fb83f91.mp4_1.png
        /*
         command.clone()
         .size('320x200')
         .save(rootPath+'/upload/videos/output-small.mp4');*/
        command.clone()
            .size('720x480')
            .addOption('-qscale', '5') // xvid 인코딩시 엄청깨짐으로 이옵션을 꼭줘야 함.
            .autopad ( 'black' )
            //.inputFPS(29.7)
            //.outputFps(24)

            .save(rootPath+'/upload/encode-xvid-640_480/'+file.filename)
            .on('end', function(stdout, stderr) {
                console.log('Transcoding succeeded !');
                Ffmpeg(rootPath+'/upload/encode-xvid-640_480/'+file.filename)
                    .screenshots({
                        //timestamps: [30.5, '50%', '01:10.123'],
                        timestamps: ['1%'],
                        filename: file.filename+'.png',
                        folder: rootPath+'/upload/videos/thumbnail/encode-xvid-640_480/',
                        size: '320x240'
                    });
            })

            .on('start', function(commandLine) {
                console.log('Spawned Ffmpeg with command: ' + commandLine);
            })
            .on('progress', function(progress) {
                console.log();

                //console.log(progress.currentFps);
                console.log("file.filename : "+file.filename+" progress.frames : "+progress.frames+" progress.currentKbps : "+progress.currentKbps+" , progress.targetSize : "+progress.targetSize);
                //console.log(progress.targetSize);
                //console.log(progress.timemark);

            });

    /* 인코딩된 파일은 다시 디비에 신규 등록 처리 */
    var fileitem = new FileItem();
    fileitem.originalname = "encXvid"+file.filename
    fileitem.filename = file.filename
    fileitem.filepath = 'upload/encode-xvid-640_480/' + file.filename;
    fileitem.save(function(err,result){
        if(err){
            console.error(err);
            return;
        }
    });
}


router.post('/encodeVideo', function(req, res) {

    console.log(req.body);
    var fileitem = new FileItem(req.body);
    console.log(fileitem);
    makeEncodeVideo(fileitem);

})

// CREATE BOOK
router.post('/utbupload', function(req, res){

    var fileitem = new FileItem();
    fileitem.filepath = 'upload/'+req.body.file_id+'.mp4';
    fileitem.originalname = req.body.file_id+'.mp4';
    fileitem.filename = req.body.file_id+'.mp4';



    var dataLensum = 0;
    var percentage = 0;
    ytdl(req.body.utburl)
        .on('response', function(res){
                var ProgressBar = require('progress');
                bar = new ProgressBar('downloading [:bar] :percent :etas', {
                    complete : String.fromCharCode(0x2588),
                    total    : parseInt(res.headers['content-length'], 10)
                });
        })
        .on( 'data', function(data){
                    //bar.tick(data.length);
            dataLensum += data.length
            //console.log((100*dataLensum/bar.total).toString());
            if(percentage != parseInt(100*dataLensum/bar.total).toString()){
                percentage = parseInt(100*dataLensum/bar.total).toString()
                console.log(req.body.file_id+" : "+percentage);

                io.emit('new-prog-msg'+req.body.file_id,
                    //file_id:req.body.file_id,
                    percentage
                );
            }
        })
        .on( 'finish', function(){
            FileItem.findById(req.body.file_id, (err, fItem) => {
                // Handle any possible database errors
                if (err) {
                    res.status(500).send(err);
                } else {
                    // Update each attribute with any possible attribute that may have been submitted in the body of the request
                    // If that attribute isn't in the request body, default back to whatever it was before.
                    fItem.filepath = fileitem.filepath;
                    fItem.originalname = fileitem.originalname;
                    fItem.filename = fileitem.filename;
                    // Save the updated document back to the database
                    fItem.save((err, fItem) => {
                        if (err) {
                            res.status(500).send(err)
                        }
                        makeThumbNail(fItem);

                        if(0==1){ // 업로드시 자동 인코딩 설정에 대한 부분
                            makeEncodeVideo(fItem)
                        }
                        res.status(200).send(fItem);
                    });
                }
            });


        })

        .pipe(fs.createWriteStream(fileitem.filepath));

})

    
return router;
}
