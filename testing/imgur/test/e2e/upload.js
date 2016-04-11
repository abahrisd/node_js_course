'use strict';

const wd = require('selenium-webdriver');
const assert = require('assert');
const path = require('path');

describe("/", function() {

  let client, server;

  let testFilePath = path.join(__dirname, '../fixture/satellite.jpg');

  before(function(done) {

    client = new wd.Builder()
      .usingServer('http://localhost:4444/wd/hub')
      .withCapabilities({ browserName: 'firefox' })
      .build();
    server = require('../../app').listen(3000, '127.0.0.1', done);
  });

  after(function(done) {
    client.quit();
    server.close(done);
  });

  it("uploads the file", function*() {
    client.get('http://localhost:3000');

    let imageInput = yield client.findElement({css: '#uploadForm [name="image"]'});
    imageInput.sendKeys(testFilePath);

    let submit = yield client.findElement({css: '#uploadForm [type="submit"]'});
    yield submit.click();

    yield client.wait(wd.until.elementLocated({css: '#uploadedImage[src^="http://i.imgur"]'}), 10000);
  });

});


