var port = process.env.PORT || 8080; // [CONFIGURE SERVER PORT]
var _server;
// [RUN SERVER]
exports.startServer  = function(app) {
    _server = app.listen(port);
    _server.on('listening', onListening);
    _server.on('error', onError);
    return _server;
}

function onListening(){
        var host = _server.address().address;
        var port = _server.address().port;
        console.log('running at http://' + host + ':' + port)

}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}
