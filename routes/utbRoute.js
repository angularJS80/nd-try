
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

const {google} = require('googleapis');
// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/drive','https://www.googleapis.com/auth/drive.file'];
const TOKEN_PATH = 'token.json';

var oAuth2Client;
var drive;
fs.readFile('credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Google Drive API.
    authorize(JSON.parse(content), setDrive);
});

function setDrive(auth){
     drive = google.drive({version: 'v3', auth});
    listFiles();
}


function listFiles() {

    drive.files.list({
        pageSize: 10,
        fields: 'nextPageToken, files(id, name)',
    }, (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);
        const files = res.data.files;
        if (files.length) {
            console.log('Files:');
            files.map((file) => {
                console.log(`${file.name} (${file.id})`);
            });
        } else {
            console.log('No files found.');
        }
    });
}

function authorize(credentials, callback) {
    const {client_secret, client_id, redirect_uris} = credentials.installed;
    oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);
    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) return getAccessToken(oAuth2Client, callback);
        oAuth2Client.setCredentials(JSON.parse(token));
        callback(oAuth2Client);
    });
}

function getAccessToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
            if (err) return console.error('Error retrieving access token', err);
            oAuth2Client.setCredentials(token);
            // Store the token to disk for later program executions
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                if (err) console.error(err);
                console.log('Token stored to', TOKEN_PATH);
            });
            callback(oAuth2Client);
        });
    });
}


module.exports = function(io) {


/*
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
});*/

makeThumbNail = function(file){
    // 아래 주석은 윈도우 기반에서 활성화 한다.
    //Ffmpeg.setFfmpegPath(rootPath +"/ffmpeg/bin/ffmpeg.exe");
    //Ffmpeg.setFfprobePath(rootPath +"/ffmpeg/bin/ffprobe.exe");

    checkDirectory(rootPath+'upload/videos/')
    checkDirectory(rootPath+'upload/videos/thumbnail/')
console.log("makeThumnail"+rootPath+file.filepath);
    Ffmpeg(rootPath+file.filepath)
        .screenshots({
            //timestamps: [30.5, '50%', '01:10.123'],
            timestamps: ['1%'],
            filename: file.filename+'.png',
            folder: rootPath+'upload/videos/thumbnail/',
            size: '320x240'
        });

}

    function isDirectoryExists(directory) {
        try {
            fs.statSync(directory);
            return true;
        } catch(e) {
            return false;
        }
    }
function checkDirectory(directory) {
    if(!isDirectoryExists(directory)){
        console.log("test11111");
        fs.mkdir(directory);
    }

}

makeEncodeVideo = function(sorcefile,targetitem){

    var percentage = 0;
    var infs = fs.createReadStream(rootPath+sorcefile.filepath);
    //var self = this;
    var command = Ffmpeg(infs)
    var command =  Ffmpeg(rootPath+sorcefile.filepath)
    var endTime = "";
    var percentage = "0";
    command.clone()
        .ffprobe(0,function(err, data) {
            console.log("err" + err);
            console.log("data" + data.streams[0].duration);
            endTime = data.streams[0].duration;
            //console.log('file1 metadata:');
            //console.dir(data);
        });
    http://localhost:38080/api/upload/encode-xvid-640_480/5a7ed772d5960c028fb83f91.mp4_1.png
        /*
         command.clone()
         .size('320x200')
         .save(rootPath+'/upload/videos/output-small.mp4');*/
        command.clone()
            .videoCodec('libxvid')
            .format('avi')
            .size('720x480')
            .addOption('-qscale', '5') // xvid 인코딩시 엄청깨짐으로 이옵션을 꼭줘야 함.
            .autopad ( 'black' )
            //.inputFPS(29.7)
            //.outputFps(24)
            .on('end', function(stdout, stderr) {
                console.log('Transcoding succeeded !');
                Ffmpeg(rootPath+'/upload/encode-xvid-640_480/'+targetitem.filename)
                    .screenshots({
                        //timestamps: [30.5, '50%', '01:10.123'],
                        timestamps: ['1%'],
                        filename: targetitem.filename+'.png',
                        folder: rootPath+'/upload/videos/thumbnail/encode-xvid-640_480/',
                        size: '320x240'
                    });

                FileItem.findById(targetitem._id, (err, fItem) => {
                    // Handle any possible database errors
                    if (err) {
                        res.status(500).send(err);
                    } else {
                        fItem.encodests = 'C';
                        fItem.source = sorcefile.filepath;
                        fItem.uptDate = Date.now();
                        fItem.save((err, fileitem) => {
                            if (err) {
                                res.status(500).send(err)
                                return;
                            }
                            console.log("encode compleat"+ fileitem);
                        });
                    }
                });
            })

            .on('start', function(commandLine) {
                FileItem.findById(targetitem._id, (err, fItem) => {
                    // Handle any possible database errors
                    if (err) {
                        res.status(500).send(err);
                    } else {
                        fItem.encodests = 'P';
                        fItem.uptDate = Date.now();
                        fItem.save((err, fileitem) => {
                            if (err) {
                                res.status(500).send(err)
                                return;
                            }
                            console.log("encode compleat"+ fileitem);
                        });
                    }
                });

                console.log('Spawned Ffmpeg with command: ' + commandLine);
            })
            //.preset('flashvideo')
            .on('progress', function(progress) {
                if(percentage != parseInt(progress.percent).toString()){
                    percentage = parseInt(progress.percent).toString()
                    console.log(targetitem._id+" : "+percentage);
                    io.emit('new-prog-msg'+targetitem._id,
                        //file_id:req.body.file_id,
                        percentage
                    );
                }

            })
            .save(rootPath+'/upload/encode-xvid-640_480/'+targetitem.filename)

        ;


/*
    var ffstream = command.pipe();
    ffstream.on('data', function(chunk) {
        console.log('ffmpeg just wrote ' + chunk.length + ' bytes');
        /!*if(percentage != parseInt(100*dataLensum/bar.total).toString()){
            percentage = parseInt(100*dataLensum/bar.total).toString()
            console.log(file.file_id+" : "+percentage);

            io.emit('new-prog-msg'+file.file_id,
                //file_id:req.body.file_id,
                percentage
            );
        }*!/
    });*/

    /* 인코딩된 파일은 다시 디비에 신규 등록 처리 */

}


router.post('/encodeVideo', function(req, res) {

    var sorcefile = new FileItem(req.body);
    var targetitem = new FileItem();
    targetitem.filename = sorcefile.id +".avi";
    targetitem.originalname = "encXvid"+sorcefile.originalname
    targetitem.filepath = 'upload/encode-xvid-640_480/' + targetitem.filename;
    targetitem.regDate = Date.now();
    targetitem.encodests = 'P';
    targetitem.save(function(err,result){
        if(err){
            console.error(err);
            return;
        }
        res.json(result);
        makeEncodeVideo(sorcefile,result);

    });


})


async function googleDriveUpload(file) {
    var folderId = '1vPhBiGcfY93t2LWNZ84QB9TBBtkw6UiQ';
    var fileMetadata = {
        'name': file.originalname,
        parents: [folderId]
    };
    var media = {
        mimeType: 'video/mp4',
        body: fs.createReadStream(rootPath+file.filepath)
    };

    const res = await drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id'
    }, function (err, file) {
        if (err) {
            // Handle error
            console.error(err);
        } else {
            console.log('File Id: ', file.id);
        }
    });
    console.log(res.data);

  /*  const res = await drive.files.create({
        requestBody: {
            name: file.originalname,
            mimeType: 'video/mp4'
        },
        media: {
            mimeType: 'video/mp4',
            body: fs.createReadStream(rootPath+file.filepath)
        }
    });
*/



}








    var utbdownload = function(utburl,fileitem){
    var dataLensum = 0;
    var percentage = 0;


    ytdl(utburl)
        .on('response', function(utbres){
            FileItem.findById(fileitem._id, (err, fItem) => {
                // Handle any possible database errors
                if (err) {
                    res.status(500).send(err);
                } else {
                    fItem.encodests = 'P';
                    fItem.uptDate = Date.now();
                    fItem.save((err, fileitem) => {
                        if (err) {
                            res.status(500).send(err)
                            return;
                        }
                        console.log("encode compleat"+ fileitem);
                    });
                }
            });

            var ProgressBar = require('progress');
            bar = new ProgressBar('downloading [:bar] :percent :etas', {
                complete : String.fromCharCode(0x2588),
                total    : parseInt(utbres.headers['content-length'], 10)
            });
        })
        .on( 'data', function(data){
            //bar.tick(data.length);
            dataLensum += data.length
            //console.log((100*dataLensum/bar.total).toString());
            if(percentage != parseInt(100*dataLensum/bar.total).toString()){
                percentage = parseInt(100*dataLensum/bar.total).toString()
                console.log(fileitem._id+" : "+percentage);

                io.emit('new-prog-msg'+fileitem._id,
                    //file_id:req.body.file_id,
                    percentage
                );
            }
        })
        .on( 'finish', function(){
            FileItem.findById(fileitem._id, (err, fItem) => {
                // Handle any possible database errors
                if (err) {
                    res.status(500).send(err);
                } else {
                    fItem.encodests = 'C';
                    fItem.uptDate = Date.now();
                    fItem.save((err, fileitem) => {
                        if (err) {
                            res.status(500).send(err)
                            return;
                        }
                        console.log("encode compleat"+ fileitem);
                    });
                }
            });

            makeThumbNail(fileitem);
            //googleDriveUpload(fileitem).catch(console.error); 구굴연동 빡시..

            if(1==0){ // 업로드시 자동 인코딩 설정에 대한 부분

                var targetitem = new FileItem();
                targetitem.filename = fileitem.id +".avi";
                targetitem.originalname = "encXvid"+fileitem.originalname;
                targetitem.filepath = 'upload/encode-xvid-640_480/' + targetitem.filename;
                targetitem.regDate = Date.now();
                targetitem.save(function(err,result){
                    if(err){
                        console.error(err);
                        return;
                    }
                    makeEncodeVideo(fileitem,result);
                });
            }
        })
        .pipe(fs.createWriteStream(fileitem.filepath));

}

// CREATE BOOK
router.post('/utbupload', function(req, res){
    var videoName = "";
    console.log(req.body.utburl)
        ytdl.getInfo(req.body.utburl, function(err, info){
            videoName = info.title.replace('|','').toString('ascii');
            var tempfile = new FileItem();
            tempfile.originalname = videoName;
            tempfile.regDate = Date.now();
            tempfile.save(function(err,result){
                if(err){
                    console.log("createFileId");
                    console.error(err);
                    res.json({result: 0});
                    return;
                }

                FileItem.findById(result._id, (err, fItem) => {
                    // Handle any possible database errors
                    if (err) {
                        res.status(500).send(err);
                    } else {
                        fItem.filename = result._id+'.mp4';
                        fItem.filepath = 'upload/'+fItem.filename ;
                        fItem.uptDate = Date.now();
                        fItem.source = req.body.utburl;
                        fItem.encodests = 'P';
                        fItem.save((err, fileitem) => {
                            if (err) {
                                res.status(500).send(err)
                                return;
                            }
                            res.json(fileitem);
                            utbdownload(req.body.utburl,fileitem)

                        });
                    }
                });

        });

    });



})

    
return router;
}
