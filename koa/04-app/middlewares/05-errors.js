

module.exports = function*(next) {

  try {
    yield* next;
  } catch (e) {
    if (e.status) {
      // could use template methods to render error page
      this.body = e.message;
      this.statusCode = e.status;
    } else {
      this.body = "Error 500";
      this.statusCode = 500;
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
};
