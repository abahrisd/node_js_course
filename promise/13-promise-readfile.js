'use strict';
// ЗАДАЧА - сделать readFile, возвращающее promise
// 

const fs = require('fs');


fs.readFile(__filename, function(err, content) {
  if (err) console.error(err)
  else console.log(content);
});

readFile(__filename).then(console.log, console.error);

// ЗАДАЧА - прочитать все файлы текущей директории, используя новый readfile
// (последовательно или параллельно - как считаете нужным)

