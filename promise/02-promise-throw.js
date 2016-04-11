// Синхронный throw тоже перехватывается then

var promise = new Promise(function(resolve, reject) {

  // то же что и
  // resolve(new Error("WOPS"));
  throw new Error("WOPS");
  // но только синхронно

});


promise.then(function(result) {
  console.log("Result", result);
}, function(err) {
  console.log("Error", err);
});

