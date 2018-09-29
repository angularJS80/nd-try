// socket io
const SocketIo = require('socket.io'); // 추가
exports.chatSoketInit  = function(server) {
    io = new SocketIo(server); // socket.io와 서버 연결하는 부분
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
    return io;
}
