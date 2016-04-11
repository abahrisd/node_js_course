// В этом коде не обрабатываются ошибки.
// Какие? Что надо исправить?

var url = require('url');
var zlib = require('zlib');
var http = require('http');
var fs = require('fs');

function fetch(srcUrl, destPath, callback) {

  var requestOptions = url.parse(srcUrl);
  requestOptions.headers = {'accept-encoding': 'gzip,deflate'};

  // request - поток, которые делает запрос
  var request = http.get(requestOptions);

  // response - поток, из которого мы читаем ответ
  request.on('response', function(response) {

    if (response.headers['content-encoding']) {
      response = response
        .pipe(zlib.createUnzip());
    }

    response
      .pipe(fs.createWriteStream(destPath))
      .on('finish', callback);

  });
}


fetch('http://ya.ru', './result.html', function(err) {
  if (err) console.error(err);
  else console.log("OK!");
});
