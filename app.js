

// serverjs

// [LOAD PACKAGES]
var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');

var cors = require('cors')();

app.use(cors);
//var mongoose    = require('mongoose');

// [ CONFIGURE mongoose ]

// CONNECT TO MONGODB SERVER
/*var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function(){
    // CONNECTED TO MONGODB SERVER
    console.log("Connected to mongod server");
});*/


//mongoose.connect('mongodb://211.249.60.229:5050/mongodb_tutorial');

// DEFINE MODEL
//var Book = require('./models/book');

// [CONFIGURE APP TO USE bodyParser]
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// [CONFIGURE SERVER PORT]
var port = process.env.PORT || 48080;

// [CONFIGURE ROUTER]
var hellowRoute = require('./routes/hellowRoute');
app.use('/api', hellowRoute);


// [RUN SERVER]
var server = app.listen(port, function(){
 console.log("Express server has started on port " + port)
});