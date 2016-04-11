// Что здесь не так? Как поправить?
var fs = require('fs');

var fileIn = fs.createReadStream(__filename, {highWaterMark: 100});

var fileOut = fs.createWriteStream(__filename + ".out", {highWaterMark: 100});

fileIn.pipe(fileOut);
