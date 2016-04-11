"use strict";

var fs = require('mz/fs');
var path = require('path');

var targetPath = __dirname;

fs.readdir(targetPath)
  .then(entries => {
    return Promise.all(entries.map(entry => fs.stat(path.join(targetPath, entry))));
  })
  .then(stats => {
    return stats.reduce(
        (prev, item) => prev + (item.isFile() ? item.size : 0),
    0);
  })
  .then(console.log, console.error);
