'use strict';

Error.stackTraceLimit = Infinity;
//require('trace');

// (!!!) encoding: null to get buffer,
// https://github.com/request/request/issues/823#issuecomment-59208292
const request = require("request").defaults({
  encoding: null
});
let should = require('should');

const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');
const config = require('config');
const Readable = require('stream').Readable;

const host = 'http://127.0.0.1:3000';

const app = require('../server');

// not in config, because many test dirs are possible
const fixturesRoot = __dirname + '/fixtures';


describe("Server", function() {

  let server;
  before(function(done) {
    server = app.listen(3000, '127.0.0.1', done);
  });

  after(function(done) {
    server.close(done);
  });

  beforeEach(function() {
    fse.emptyDirSync(config.get('filesRoot'));
  });

  describe("GET /file.ext", function() {

    context("When exists", function() {
      beforeEach(function() {
        // "before" will not do here,
        // because it works "before tests"
        // and parent beforeEach works "before each test", that is after before
        fse.copySync(`${fixturesRoot}/small.png`, config.get('filesRoot') + '/small.png');
      });

      it("returns 200 & the file", function(done) {
        let fixtureContent = fs.readFileSync(`${fixturesRoot}/small.png`);

        request.get(`${host}/small.png`, function(error, response, body) {
          if (error) return done(error);
          // (!!!) not body.should.eql(fixtureContent),
          // cause buffers are compared byte-by-byte for diff (slow)
          body.equals(fixtureContent).should.be.true;
          done();
        });


      });
    });

    context("otherwise", function() {
      it("returns 404", function(done) {

        request.get(`${host}/small.png`, function(error, response, body) {
          if (error) {
//            console.log('error recieved:' + JSON.stringify(error))
            return done(error);
          }
          console.log('response.statusCode:' + JSON.stringify(response.statusCode));
          response.statusCode.should.be.equal(404);
          done();
        });

      });

    });
  });

  describe("GET /nested/path", function() {
    it("returns 400", function(done) {

      request.get(`${host}/nested/path`, function(error, response, body) {
        if (error) {
          console.log('error nested response.statusCode:' + JSON.stringify(response.statusCode));
          return done(error);
        }

        console.log('nested response.statusCode:' + JSON.stringify(response.statusCode));
        response.statusCode.should.be.equal(400);
        done();
      });

    });

  });

  describe("POST /file.ext", function() {

    context("When exists", function() {
      beforeEach(function() {
        fse.copySync(`${fixturesRoot}/small.png`, config.get('filesRoot') + '/small.png');
      });

      context("When small file size", function() {
        it("returns 409 & file not modified", function(done) {

          let mtime = fs.statSync(config.get('filesRoot') + '/small.png').mtime;

          let req = request.post(`${host}/small.png`, function(error, response, body) {
            if (error) return done(error);

            let newMtime = fs.statSync(config.get('filesRoot') + '/small.png').mtime;
            console.log('When small file size response.statusCode:', response.statusCode, newMtime, mtime);
            // eql compares dates the right way
            mtime.should.eql(newMtime);

            console.log('When small (409) response.statusCode:', response.statusCode);
            response.statusCode.should.be.equal(409);
            done();
          });

          fs.createReadStream(`${fixturesRoot}/small.png`).pipe(req);

        });

        context('When zero file size', function() {
          it('returns 409', function(done) {
            let req = request.post(`${host}/small.png`, function(error, response, body) {
              if (error) return done(error);

              response.statusCode.should.be.equal(409);
              done();
            });

            let stream = new Readable();

            stream.pipe(req);
            stream.push(null);

          });
        });


      });

      context("When too big", function() {

        it.only("return 413 and no file appears", function(done) {

          let req = request.post(`${host}/big.png`, function(error, response, body) {
            if (error) return done(error);
            response.statusCode.should.be.equal(413);

            fs.existsSync(config.get('filesRoot') + '/small.png').should.be.false;
            done();
          });

          fs.createReadStream(`${fixturesRoot}/big.png`).pipe(req);
        });

      });
    });

    context("otherwise with zero file size", function() {

      it('returns 200 & file is uploaded', function(done) {
        let req = request.post(`${host}/small.png`, function(error, response, body) {
          if (error) return done(error);

          fs.statSync(config.get('filesRoot') + '/small.png').size.should.equal(0);

          done();
        });

        let stream = new Readable();

        stream.pipe(req);
        stream.push(null);

      });

    });

    context("otherwise", function() {

      it("returns 200 & file is uploaded", function(done) {
        let req = request.post(`${host}/small.png`, function(error, response, body) {
          if (error) return done(error);
          fs.readFileSync(config.get('filesRoot') + '/small.png').equals(
            fs.readFileSync(`${fixturesRoot}/small.png`)
          ).should.be.true;
        });

        fs.createReadStream(`${fixturesRoot}/small.png`).pipe(req);
        done();
      });
    });

  });


});
