// serverjs

// [LOAD PACKAGES]
var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var mongoose    = require('mongoose');

// [ CONFIGURE mongoose ]

// CONNECT TO MONGODB SERVER
var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function(){
    // CONNECTED TO MONGODB SERVER
    console.log("Connected to mongod server");
});

mongoose.connect('mongodb://localhost/mongodb_tutorial');

// DEFINE MODEL
var Book = require('./models/book');

// [CONFIGURE APP TO USE bodyParser]
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// [CONFIGURE SERVER PORT]

var port = process.env.PORT || 8080;

// [CONFIGURE ROUTER]
//var router = require('./routes')(app, Book);

var bookRoute = require('./routes/bookRoute');
var chatRoute = require('./routes/chatRoute');
app.use('/api', [bookRoute,chatRoute]);



// [RUN SERVER]
var server = app.listen(port, function(){
 console.log("Express server has started on port " + port)
});

const SocketIo = require('socket.io'); // 추가
const socketEvents = require('./soket/chatsocket'); // 추가
const io = new SocketIo(server); // socket.io와 서버 연결하는 부분
socketEvents(io); // 아까 만든 이벤트 연결
