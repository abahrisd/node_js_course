const http = require('http');
const mime = require('mime');
const path = require('path');
const url = require('url');
const fs = require('fs');

var publicDir = path.join(process.cwd(), 'public');

const server = new http.Server();

// localhost:3000/index.html  -> public/index.html
server.on('request', function (req, res) {
  const urlPath = decodeURI(url.parse(req.url).pathname);
  const filePath = path.join(publicDir, urlPath);

  // check if the file into the public dir and this is no public dir
  if (!filePath.startsWith(publicDir + path.sep)) {
    res.statusCode = 400;
    res.end("Bad request");
    return;
  }

  var fileStream = fs.createReadStream(filePath);

  // if error - show error (not found or no rights)
  fileStream.on('error', function (err) {
    // error in reading (maybe no file)
    if (err.code === 'ENOENT' || err.code === 'EISDIR') {
      res.statusCode = 404;
      res.end('File not Found');
    } else {
      console.error(err);
      res.statusCode = 500;
      res.end("Server Error");
    }
  });

  fileStream.on('open', function() {
    var type = mime.lookup(filePath);
    res.setHeader('Content-Type', type);
  });


  // if connection lost - destroy the stream
  res.on('close', function () {
    fileStream.close();
  });

  // res.on('error') - не бывает
  // res.on('close') - обрыв соединения (finish - успешный конец записи)

  fileStream.pipe(res);

});

module.exports = server;
