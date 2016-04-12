// Каждый stream генерирует свои ошибки, они не форвардятся

var zlib = require('zlib');
var fs = require('fs');

const stream = fs.createWriteStream('test');
const file = fs.createReadStream('test.gz');
const gzip = zlib.createGzip();


  file
    .on('error', onerror)
  .pipe(gzip)
    .on('error', onerror)
  .pipe(stream)
    .on('error', onerror)

  stream.on('finish', function(){
    console.log('finish');
  })

//важно закрыть все потоки которые держат на себе внешние ресурсы
function onerror(err){
  fs.unlink(stream.filePath, function(){});

  stream.destroy();
  file.destroy();
  //gzpi.destroy();//не обязательно и если есть метод

}