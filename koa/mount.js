var koa = require('koa');
var app = koa();
var mount = require('koa-mount');
var Router = require('koa-router');

var webmoneyRouter = new Router();

webmoneyRouter.get('/callback', function*(next) {
  this.body = "Webmoney " + this.path;
});

var paypalRouter = new Router();

paypalRouter.get('/callback', function*(next) {
  this.body = "Paypal " + this.path;
});


function* payment(next) {
  yield* mount('/webmoney', webmoneyRouter.middleware()).call(this, next);
  yield* mount('/paypal', paypalRouter.middleware()).call(this, next);
}

app.use(mount('/payment', payment));

app.listen(3000);
