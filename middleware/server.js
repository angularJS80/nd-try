var port = process.env.PORT || 38080; // [CONFIGURE SERVER PORT]
// [RUN SERVER]
exports.startServer  = function(app) {
    var server = app.listen(port, function(){
        console.log("Express server has started on port " + port)
    });
    return server;
}

