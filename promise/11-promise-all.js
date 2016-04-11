// несколько promise параллельно
// Вопрос - если ошибка, то как сделать, чтобы остальные результаты были получены,
// а вместо ошибочного - объект ошибки?

var http = require('http');

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

// если хоть один loadUrl вернёт ошибку,
// то другие все результаты отбрасываются, выполнение идёт в catch

// ВОПРОС: как сделать, чтобы не отбрасывались? Т.е. получать в results объект ошибки

Promise.all([
  loadUrl('http://ya.ru'),
  loadUrl('http://javascript.ru'),
  loadUrl('http://learn.javascript.ru')
]).then(function(results) {
  console.log(results.map(function(html) { return html.slice(0,80); }));
}).catch(console.log);
