
// socket io
module.exports = function(io) {
    io.on('connection', function (socket) {
        console.log('User connected');
        socket.on('disconnect', function() {
            console.log('User disconnected');
        });
        socket.on('add-msg', function (data) {
            console.log(data);
            io.emit('new-msg', data);
        });
    });
}





