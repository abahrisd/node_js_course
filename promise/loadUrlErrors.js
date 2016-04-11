'use strict';
const fs = require('fs'),
    http = require('http');

let urls = ['http://lenta.ru','http://delfi.ee', 'htеp://www.avpsoft.aaaa', 'htp://javascript.ru'];

Promise.all(
    urls.map(
      url => loadUrl(url).catch(err => err)
    )
).then(console.log);

function loadUrl(url) {
  return new Promise(function(resolve, reject) {

    http.get(url, function(res) {
      if (res.statusCode != 200) { // ignore 20x and 30x for now
        reject(new Error(`Bad response status ${res.statusCode}.`));
        return;
      }

      var body = '';
      res.setEncoding('utf8');
      res.on('data', function(chunk) {
        body += chunk;
      });
      res.on('end', function() {
        resolve(body);
      });

    }) // ENOTFOUND (no such host ) or ECONNRESET (server destroys connection)
      .on('error', reject);
  });
}