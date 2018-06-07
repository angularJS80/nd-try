const http = require('http');
const hostname = '127.0.0.1';
const port = 1337;

http.createServer((req, res) => {

    console.log(req);




  res.setHeader('Content-Type', 'application/json');

    var hellows=[];
    hellows.push({"hellow_id":"japen","hellow":"こんにちは"});
    hellows.push({"hellow_id":"korea","hellow":"안녕하세요."});

    var heloowsString = JSON.stringify(hellows);


    res.end(heloowsString);

}).listen(port, hostname, function(){
    console.log(`Server running at http:// ${hostname}: ${port}/`);
});