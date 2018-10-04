// [LOAD PACKAGES]
var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var mongodbConnection = require('./middleware/mongodbConnection')
var mysqlConnection = require('./middleware/mysqlConnection')
var cors = require('cors')();
var verifyToken = require('./middleware/verifytoken');
var swagger = require('./middleware/swagger');
var socket = require('./middleware/socket');
var server = require('./middleware/server');

// [CONFIGURE APP TO USE bodyParser]
app.use(bodyParser.urlencoded({ extended: true  }));
app.use(bodyParser.json());

// [CONFIGURE Cors]
app.use(cors);

// [CONFIGURE MongoDb Connection]
mongodbConnection.mongodbConnect();

// [CONFIGURE Mysql Connection]
mysqlConnection.mysqlSequelize();


// [CONFIGURE Swagger]
swagger.swaggerInit(app);

// [CONFIGURE Server]
var server = server.startServer(app);

// [CONFIGURE Socket Io]
var io = socket.chatSoketInit(server);
global.config = require('./middleware/config');

// [CONFIGURE Static Url]
app.use("/api/upload/", express.static(__dirname + '/upload/videos/thumbnail/'));


// [CONFIGURE ROUTER]라우터이외 모듈화
app.use('/api', verifyToken,
    [
     require('./routes/bookRoute')
    ,require('./routes/chatRoute')
    ,require('./routes/templeatRouter')
    ,require('./routes/streamRoute')
    ,require('./routes/fileRoute')
    ,require('./routes/s3upload')
    ,require('./routes/utbRoute')(io)
]
);
app.use('/openapi',
    require('./routes/userRoute')
);



