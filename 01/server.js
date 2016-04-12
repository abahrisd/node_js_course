'use strict';

const http = require('http');
const handler = require('./handler');

const server = new http.Server();

server.on('request', handler);

server.listen(8001);



