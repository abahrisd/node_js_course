// .catch - перехватывает только ошибки
// ВОПРОС - есть ли разница между .then(ok, fail) VS .then(ok).catch(fail) ?

var promise = new Promise(function(resolve, reject) {

  // then не перехватит это
  // нужно было reject!
  setTimeout(function() {
    throw new Error("WOPS");
  }, 1);

});


promise.then(function(result) {
  console.log("Result", result);
}).catch(function(err) {
  console.log("Error", err);
});

