var zlib = require('zlib');
var fs = require('fs');
var combine = require('stream-combiner2');

combine(
  fs.createReadStream('bad.gz'),
  zlib.createGunzip(),
  fs.createWriteStream('test')
)
  .on('error', cleanup)
  .on('finish', function() {
    console.log("DONE");
  });

function cleanup() {
  fs.unlink('bad.gz', function(err) {
    /* should be no error, if the file exists, then it is ours */
  });
}


// JS -> libuv -> JS