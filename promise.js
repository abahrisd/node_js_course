'use strict';

process.on('unhandledRejection', function(err, p) {
  console.error(err.stack);
});

let promise = new Promise((resolve, reject) => {

  blabla();
  

});

