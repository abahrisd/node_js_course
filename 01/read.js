'use strict';
const fs = require('fs')
/*
fs.readFile(__filename, function(err, content){
  console.log(content);
})*/

  const stream = new fs.ReadStream(__filename, {
    highWaterMark: 40,
    encoding: 'utf-8'
  });

//flowing/paused

//paused - readable
//поток на паузе, он не генерирует событие data, мы можем вытянуть данные из потока выполнив stream.read();
// поток можн оснять с паузы через stream.resume(); - вот это не факт, надо проверить

  /*stream.on('readable', function(){
    console.log("\n ------------ \n",stream.read());
  });*/

//flowing - data, пока мы не ставим обработчик на data - поток переходит в состояние flowing
// - т.е. поток генерирует событие data. Считал - сгенерировал, считал - сгенерировал,
// он не ждёт когда мы считаем данные через stream.read();
  stream.on('data', function(chunk){
    console.log("\n ------------ \n",chunk);
  });

  stream.on('readable', function(){
    console.log("\n ------------ readable\n");
  });

//stream.pause();
//stream.resume();

stream.on('end', () => console.log('END!'))
//1.05.35