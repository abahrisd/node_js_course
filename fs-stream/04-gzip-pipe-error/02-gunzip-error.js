// Какие здесь возможны ошибки? Как правильно?

var zlib = require('zlib');
var fs = require('fs');

fs.createReadStream('test.gz')
  .pipe(zlib.createGunzip())
  .pipe(fs.createWriteStream('test'))
  .on('finish', function() {
    console.log("DONE");
  });
