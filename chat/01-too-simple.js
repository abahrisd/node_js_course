// слишком простой чат, в коде есть минимум 7 серьёзных ошибок - КАКИХ?

var http = require('http');
var fs = require('fs');

var clients = [];

http.createServer(function(req, res) {

  switch (req.method + ' ' + req.url) {
  case 'GET /':
    fs.createReadStream('index.html').pipe(res);
    break;

  case 'GET /subscribe':
    console.log("subscribe");
    clients.push(res);
    break;

  case 'POST /publish':
    var body = '';

    req
      .on('data', function(data) {
        body += data;
      })
      .on('end', function() {
        body = JSON.parse(body);

        console.log("publish '%s'", body.message);

        clients.forEach(function(res) {
          res.end(body.message);
        });

        clients = [];

        res.end("ok");
      });

    break;

  default:
    res.statusCode = 404;
    res.end("Not found");
  }


}).listen(3000);

