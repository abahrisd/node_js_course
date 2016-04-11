// Typical middleware examples

var koa = require('koa');
var fs = require('mz/fs');
var app = koa();

// 1. Wrap into a meta function (count time, catch errors...)
app.use(function* (next) {
  console.log('--> request start', this.url);

  var time = new Date();

  yield* next;

  time = new Date() - time;

  console.log('<-- request end', time, 'ms');
  // node.js finished, but...
  // response body may be not yet fully sent out,
  // use on-finished for that (or see koa-logger how to track full body length)
});

// 2. Add goodies to this (or this.request/response, but not req/res)
app.use(function* (next) {
  console.log('--> add useful method to this');

  this.renderFile = function* (file) { // просто function без * - ошибка!
    this.body = yield fs.readFile(file, 'utf-8');
  }.bind(this); // зафиксировали this в генераторе

  yield* next;
});

// 3. Do the work, assign this.body (or throw)
app.use(function* () {
  console.log('--> work, work!');

  if (this.url != '/') {
    this.throw(404);
  }

  yield* this.renderFile(__filename); // если без yield, то не сработает!

  console.log('<-- work complete, body sent!');
});

app.listen(3000);
