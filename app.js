// serverjs

// [LOAD PACKAGES]
var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var mongoose    = require('mongoose');

var cors = require('cors')();
app.use(cors);

// [ CONFIGURE mongoose ]

// CONNECT TO MONGODB SERVER
var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function(){
    // CONNECTED TO MONGODB SERVER
    console.log("Connected to mongod server");
});

mongoose.connect('mongodb://localhost/mongodb_tutorial');

// [CONFIGURE APP TO USE bodyParser]
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// [CONFIGURE SERVER PORT]
var port = process.env.PORT || 38080;

// [CONFIGURE ROUTER]
//var router = require('./routes')(app, Book);

var bookRoute = require('./routes/bookRoute');
var chatRoute = require('./routes/chatRoute');
var streamRoute = require('./routes/streamRoute');
var fileRoute = require('./routes/fileRoute');


app.use('/api', [
    bookRoute
    ,chatRoute
    ,streamRoute
    ,fileRoute
]);

// [RUN SERVER]
var server = app.listen(port, function(){
 console.log("Express server has started on port " + port)
});

const SocketIo = require('socket.io'); // 추가
const socketEvents = require('./soket/chatsocket'); // 추가
const io = new SocketIo(server); // socket.io와 서버 연결하는 부분
socketEvents(io); // 아까 만든 이벤트 연결


