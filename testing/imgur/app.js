'use strict';

let url = require('url');
let fs = require('fs');
let upload = require('./lib/upload');
let koa = require('koa');
let Router = require('koa-router');
let busboy = require('co-busboy');

let app = koa();


let router = new Router();

router.get('/', function*() {
  this.type = 'text/html;charset=utf-8';
  this.body = fs.createReadStream(__dirname + '/public/index.html');
});


router.post('/upload', function*() {

  let parser = busboy(this);
  let part;

  let uploaded;
  while (part = yield parser) {
    if (part.length) {
      this.request.body[part[0]] = part[1];
    } else {

      // otherwise, it's a file stream
      if (!part.filename) { // empty file field
        part.resume();
        continue;
      }
      if (part.fieldname != 'image') { // unknown (?) field
        part.resume();
        continue;
      }

      try {
        uploaded = yield* upload(part.filename, this.request.imageSize, part);
      } catch(e) {
        if (e.name == 'StatusCodeError') {
          console.error("ERROR", e);
          this.status = e.statusCode;
          this.body = e.error.data;
          return;
        } else {
          throw e;
        }
      }
      break;
    }
  }

  if (!uploaded) {
    this.status = 400;
    this.body = {
      error: "No image"
    };
    return;
  }

  this.status = 201;
  this.body = {
    link: uploaded.link
  };

});

app.use(router.routes());

module.exports = app;
