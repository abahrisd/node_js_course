// Handling errors

var koa = require('koa');
var app = koa();


app.use(function*(next) {

  try {
    yield* next;
  } catch (e) {
    if (e.status) { // User error
      this.body = e.message;
      this.status = e.status;
    } else { // Server error
      this.body = "Error 500";
      this.status = 500;
      console.error(e.message, e.stack);
    }

      
    // no accept header means html is returned
    let type = this.accepts('html', 'json');
    if (type == 'json') {
      this.body = {
        error: this.body
      };
    }
  }


});

app.use(function* (next) {

  switch(this.url) {
    case '/1':
      // no stack trace, 500
      // require('trace') does not help
      yield function(callback) {
        setTimeout(function() {
          callback(new Error("Error in callback"));
        }, 1000);
      };
      break;

    case '/2':
      // stack trace, 500
      yield new Promise(function(resolve, reject) {
        setTimeout(reject, 1000, new Error("Error in callback"));
      });
      break;

    case '/3':
      // stack trace, 500
      throw(new Error("Error thrown"));

    case '/4':
      /* jshint -W086 */
      // user-level error (the difference: error.status), show 403
      this.throw(403);

    default:
      this.body = 'ok';
  }

  // will not catch not "any" throw
  // throw on a new stack kills the process
  /*
   setTimeout(function() {
   throw new Error("DIE!");
   }, 1000);
   */

});

app.listen(3000);
