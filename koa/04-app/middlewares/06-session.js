// in-memory store by default (use the right module instead)
var session = require('koa-generic-session');
module.exports = session();
