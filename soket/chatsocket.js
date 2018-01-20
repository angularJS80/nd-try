
// socket io
module.exports = function(io) {
    io.on('connection', function (socket) {
        console.log('User connected');
        socket.on('disconnect', function() {
            console.log('User disconnected');
        });
        socket.on('save-message', function (data) {
            console.log(data);
            io.emit('new-message', { message: data });
        });
    });
}





