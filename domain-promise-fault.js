// Domains + Promise =/= (heart)
// 
var domain = require('domain').create();

domain.on('error', function() {
  console.log('caught');
});

domain.run(function() {

  Promise.resolve(1)
    .then(function() {
      setImmediate(function() {
        throw new Error("WOPS");
      });
    });

});
