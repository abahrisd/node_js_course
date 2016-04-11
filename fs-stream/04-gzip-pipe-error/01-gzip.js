// Каждый stream генерирует свои ошибки, они не форвардятся

var zlib = require('zlib');
var fs = require('fs');

fs.createReadStream(__filename) // error (file not found or reading problem or ...)
  .pipe(zlib.createGzip())
  .pipe(fs.createWriteStream(__filename + '.gz')) // error (perm denied or ...)
  .on('finish', function() {
    console.log("DONE");
  });
