var http = require('http');

var server = new http.Server();

server.on('request', require('handler'));

server.listen(8000);
