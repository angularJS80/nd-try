// [LOAD PACKAGES]
var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var mongoose    = require('mongoose');
var cors = require('cors')();

app.use(cors);
// [CONFIGURE APP TO USE bodyParser]
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/api/upload/", express.static(__dirname + '/upload/videos/thumbnail/'));

// [ CONFIGURE mongoose ]
var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function(){
    // CONNECTED TO MONGODB SERVER
    console.log("Connected to mongod server");
});
// CONNECT TO MONGODB SERVER
mongoose.connect('mongodb://localhost:5050/mongodb_tutorial');


// [CONFIGURE SERVER PORT]
var port = process.env.PORT || 38080; // [CONFIGURE SERVER PORT]
// [RUN SERVER]
var server = app.listen(port, function(){
    console.log("Express server has started on port " + port)
});

const SocketIo = require('socket.io'); // 추가
const socketEvents = require('./soket/chatsocket'); // 추가
const io = new SocketIo(server); // socket.io와 서버 연결하는 부분
socketEvents(io); // 아까 만든 이벤트 연결

// [CONFIGURE ROUTER]
app.use('/api', [
    require('./routes/bookRoute')
    ,require('./routes/chatRoute')
    ,require('./routes/streamRoute')
    ,require('./routes/fileRoute')
    ,require('./routes/utbRoute')(io)
]);
