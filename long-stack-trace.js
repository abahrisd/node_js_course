
if (process.env.DEV_TRACE) {
  Error.stackTraceLimit = 10000;
  require('trace');
  require('clarify');
}


function f(ms) {
  setTimeout(function() {
    throw new Error("BAH!");
  }, ms);
}

function g() {
  f(10);
}

g();
