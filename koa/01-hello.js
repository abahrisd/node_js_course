// The simplest example of Koa

var koa = require('koa');

var app = koa();

/**
 * Основные объекты:
 * this.req / this.res
 * this.request / this.response
 * this (контекст)
 *
 * Основные методы:
 * this.set/get
 * this.body=
 */
app.use(function*() {

  /* sleep(1000); */
  yield function(callback) {
    setTimeout(callback, 1000);
  };

  this.body = "hello"; // {result: "hello"}

});

app.listen(3000);
