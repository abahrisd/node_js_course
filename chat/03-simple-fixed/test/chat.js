'use strict';

const request = require('request');
const chat = require('../chat');
const should = require('should');

describe("server", function() {

  before(function(done) {
    chat.listen(3000, '127.0.0.1', done);
  });

  after(function(done) {
    chat.close(done);
  });

  describe("POST /publish", function() {

    it("sends a message to all subscribers", function(done) {

      var count = -1;
      var message = "text";

      while(++count < 2) {
        request({
          method: 'GET',
          url: 'http://127.0.0.1:3000/subscribe',
          timeout: 100
        }, function(err, response, body) {
          // expect timeout (no message) after 100ms
          if (err) done(err);
          body.should.be.eql(message);
          if (--count == 0) done();
        });
      }

      request({
        method: 'POST',
        url: 'http://127.0.0.1:3000/publish',
        json: true,
        body: {
          message
        }
      }, function(err, response, body) {
        // ignore the POST response unless error
        if (err) done(err);
      });


    });
  

    describe("when body is too big", function() {

      it("ignores the message", function(done) {
        request({
          method: 'GET',
          url: 'http://127.0.0.1:3000/subscribe',
          timeout: 100
        }, function(err, response, body) {
          // expect timeout (no message) after 100ms
          should(err && err.code).be.equal('ETIMEDOUT');
          done();
        });

        request({
          method: 'POST',
          url: 'http://127.0.0.1:3000/publish',
          json: true,
          body: {
            message: "*".repeat(1e4)
          }
        }, function(err, response, body) {
          // ignore the POST response unless error
          if (err) done(err);
        });

      });


      it("returns 413", function(done) {
        request({
          method: 'POST',
          url: 'http://127.0.0.1:3000/publish',
          body: "*".repeat(1e4)
        }, function(err, response, body) {
          if (err) return done(err);

          response.statusCode.should.be.eql(413);

          done();

        });
      });
    });



  });

});