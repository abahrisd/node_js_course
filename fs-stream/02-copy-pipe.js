// Копирование файлов
// Проблема - какая? Зачем pipe?
var fs = require('fs');

// try to create readstream from file
var fileIn = fs.createReadStream(__filename, {highWaterMark: 100});

var fileOut = fs.createWriteStream(__filename + ".out", {highWaterMark: 100});

fileIn.on('data', function(data) {
  console.log(fileOut.write(data));
});

fileIn.on('close', function() {
  fileOut.close();
});


//fileIn.pipe(fileOut);
