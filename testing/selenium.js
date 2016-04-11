'use strict';

// java -jar selenium-server-standalone.jar

const wd = require('selenium-webdriver');
const assert = require('assert');

var client = new wd.Builder()
  .usingServer('http://localhost:4444/wd/hub')
  .withCapabilities({ browserName: 'firefox' })
  .build();

// Schedules the flow to execute a custom function.
// @see lib/webdirver.js: call(...)
client.call(function* () {
  
  client.get('http://www.google.com/ncr');

  let qInput = yield client.findElement({name: 'q'});
  qInput.sendKeys('webdriver', wd.Key.ENTER);

  yield client.wait(function* () {
    var title = yield client.getTitle();
    return 'webdriver - Google Search' === title;
  }, 5000);

  console.log("Got the title");

})
  .catch(err => console.error(err.stack))
  .then(() => client.quit()); // quit even in case of an error
