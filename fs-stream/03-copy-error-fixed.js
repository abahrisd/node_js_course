var fs = require('fs');

var fileIn = fs.createReadStream(__filename, {highWaterMark: 100});

var fileOut = fs.createWriteStream(__filename + ".out", {highWaterMark: 100});

fileIn.pipe(fileOut);

// I/O error can't happen between lines of JS
fileIn.on('error', cleanup);
fileOut.on('error', cleanup);

function cleanup() {
  fs.unlink(fileOut.path, function(err) {
    /* it's ok if no such file, ignore the error */
  });

  // close both files (otherwise won't be closed! no close event!)
  fileIn.destroy();
  fileOut.destroy();
}
