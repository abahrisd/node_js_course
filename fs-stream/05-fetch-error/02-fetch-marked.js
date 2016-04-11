// В этом коде не обрабатываются ошибки.
// Какие? Что надо исправить?

var url = require('url');
var zlib = require('zlib');
var http = require('http');
var fs = require('fs');

function fetch(srcUrl, destPath, callback) {

  var requestOptions = url.parse(srcUrl);
  requestOptions.headers = {'accept-encoding': 'gzip,deflate'};

  // -----> request.on('error') ?  (некорректный url)
  // -----> request.setTimeout(ms, handler) (упал интернет или удалённый сервер долго не отвечает)
  var request = http.get(requestOptions);


  request.on('response', function(response) {
    // response.on('error/close') ставить нет необходимости, т.к. request.on('error') учтёт все ошибки запроса

    if (response.headers['content-encoding']) {
      response = response

        .pipe(zlib.createUnzip()); // ----> ошибка разархивирования?

    }

    response
      .pipe(fs.createWriteStream(destPath)) // ----> ошибка записи
      .on('finish', callback);

  });
}


fetch('http://ya.ru', './result.html', function(err) {
  if (err) console.error(err);
  else console.log("OK!");
});
