'use strict';

const request = require('request-promise');
const mime = require('mime');
const config = require('config');

module.exports = function*(fileName, fileSize, stream) {
  let options = {
    url: 'https://api.imgur.com/3/image',
    headers: {
      Authorization: 'Client-ID ' + config.get('imgur.clientId')
    },
    json: true,
    formData: {
      type:  'file',
      image: {
        value: stream,
        options: {
          filename: fileName,
          contentType: mime.lookup(fileName),
          knownLength: fileSize
        }
      }
    }
  };

  let body = yield request.post(options);

  if (!body.data || !body.success) {
    console.error("Upload failed", body);
    throw new Error("Imgur upload failed");
  }

  return body.data;

};
