var zlib = require('zlib');
var http = require('http');
var fs = require('fs');
var url = require('url');

function fetch(srcUrl, destPath, callback) {

  var requestOptions = url.parse(srcUrl);
  requestOptions.headers = {'accept-encoding': 'gzip,deflate'};

  var request = http.get(requestOptions);
  var fstream;

  var hadError = false;

  // any error must cause a cleanup, unfinished file removal
  function onError(err) {
    hadError = true;
    if (fstream) fstream.destroy();
    fs.unlink(destPath, function(err) {
      /* unlink fails if destPath does not exist, we ignore the fail */
    });
    callback(err);
  }

  request.on('error', onError);

  request.setTimeout(10000, function() {
    request.destroy();
    onError(new Error("Timeout"));
  });

  request.on('response', function(response) {

    if (response.headers['content-encoding']) {
      response = response
        .pipe(zlib.createUnzip())
        .on('error', onError); // bad gzip in response?
    }

    fstream =  fs.createWriteStream(destPath);

    response
      .pipe(fstream)
      // --->
      .on('error', onError) // not enough disk space? permission denied?
      .on('finish', function() {
        // finish always happens, but maybe the file is unfinished (or another error)
        if (!hadError) callback();
      });

  });
}



fetch('http://ya.ru', './result.html', function(err) {
  if (err) console.error(err);
  else console.log("OK!");
});
