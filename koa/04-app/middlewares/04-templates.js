// initialize template system early, to let error handler use them
// koa-views is a wrapper around many template systems!
// most of time it's better to use the chosen template system directly
var views = require('koa-views');
var config = require('config');
var path = require('path');

module.exports = views(path.join(config.root, 'templates'), {
  default: 'jade'
});

