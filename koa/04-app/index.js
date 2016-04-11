// A "closer to real-life" app example
// using 3rd party middleware modules
// P.S. MWs calls be refactored in many files

// long stack trace (+clarify from co) if needed
if (process.env.TRACE) {
  require('./libs/trace');
}

var koa = require('koa');
var app = koa();

var config = require('config');

// keys for in-koa KeyGrip cookie signing (used in session, maybe other modules)
app.keys = [config.secret];

var path = require('path');
var fs = require('fs');
var middlewares = fs.readdirSync(path.join(__dirname, 'middlewares')).sort();

middlewares.forEach(function(middleware) {
  app.use(require('./middlewares/' + middleware));
});

// ---------------------------------------

// can be split into files too
var Router = require('koa-router');

var router = new Router();
router.get('/views', function* (next) {
  var count = this.session.count || 0;
  this.session.count = ++count;

  yield this.render('index', {
    user: 'John',
          count
  });
});

router.get('/', function*() {
  this.redirect('/views');
});

app.use(router.routes());

app.listen(3000);
