"use strict";

let fs = require("fs");
let co = require("co");

co(function* () {
  let stream = new fs.ReadStream(__filename, { highWaterMark: 20, encoding: "utf-8" });
  let chunk = null;
  let reader = readStream(stream);

  while (chunk = yield reader()) {
    console.log(chunk);
    yield function(callback) {
      setTimeout(callback, 500);
    };
  }


}).then(result => console.log("finished"), console.error);


function readStream(stream) {
  let onFulfilled = null;
  let onRejected = null;

  function cleanup() {
    stream.removeListener("data", onFulfilled);
    stream.removeListener("error", onRejected);
  }

  return () => new Promise((resolve, reject) => {
    onFulfilled = data => {
      cleanup();
      stream.pause();
      resolve(data);
    };

    onRejected = error => {
      cleanup();
      reject(error);
    };

    stream.on("data", onFulfilled);
    
    stream.on("error", onRejected);
    stream.resume();
    
  });

}
