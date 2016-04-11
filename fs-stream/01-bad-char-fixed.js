var fs = require('fs');

var fileStream = fs.createReadStream('bad-char.txt', {highWaterMark: 9 /* читать по 9 байт для наглядности */});

/*
// Вариант 1 указать кодировку
// Нода будет сама декодировать буфер в строку,
// если она битая - запоминать лишние символы и приплюсовывать их в начало следующего пакета
fileStream.setEncoding('utf-8');

var content = '';
fileStream.on('data', function(data) {
  content += data;
});

fileStream.on('end', function() {
  console.log(content);
});
*/

/*
// Вариант 2
// Читать массив буферов, потом всё объединять и уже тогда приводить к строке
var dataPieces = [];

fileStream.on('data', function(buffer) {
  dataPieces.push(buffer);
});

fileStream.on('end', function() {
  var buffer = Buffer.concat(dataPieces);
  console.log(buffer.toString());
});
*/
