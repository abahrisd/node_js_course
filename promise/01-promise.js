// Сработает ЛИБО reject ЛИБО resolve
// смотря что раньше выполнится

var promise = new Promise(function(resolve, reject) {

  // функция сразу запускается, делает что-то,
  // потом обязана вызвать resolve(res) или reject(err), по аналогии с callback

  setTimeout(function() {
    resolve("OK");
  }, 1000);

  // не сработает! Можно запустить resolve/reject только 1 раз
  setTimeout(function() {
    reject(new Error("WOPS!"));
  }, 2000);

});


promise.then(function(result) {
  console.log("Result", result);
}, function(err) {
  console.log("Error", err);
});


