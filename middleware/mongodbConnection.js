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

    //mongoose.connect('mongodb://172.31.34.84:25050/mongodb_tutorial');
    mongoose.connect('mongodb://'+process.env.MONGODB_SERVER+':25050/mongodb_tutorial');
    
}
