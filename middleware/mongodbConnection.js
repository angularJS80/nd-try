// [ CONFIGURE mongoose ]
var mongoose    = require('mongoose');
var db = mongoose.connection;

exports.mongodbConnect = function() {
    db.on('error', console.error);
    db.once('open', function(){
        // CONNECTED TO MONGODB SERVER
        console.log("Connected to mongod server");
    });
// CONNECT TO MONGODB SERVER

    mongoose.connect('mongodb://localhost:5050/mongodb_tutorial');
}