// до тестов не доходят статусы кроме 200

'use strict';

const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('mz/fs');
const mime = require('mime');
const config = require('config');
const koa = require('koa');
const router = require('koa-router')();
const busboy = require('co-busboy')
const createError = require('http-errors');

let app = koa();

app.use(function*(next) {

    console.log(this.headers);
    try {
        yield* next;
    } catch (e) {
        console.log('error handling', e);
        if (e.status) { // User error
            this.status = e.status;
            this.body = e.message;
            console.log('user error', e.status);
        } else { // Server error
            this.status = 500;
            this.body = "Error 500";
            console.error(e.message, e.stack);
        }

        let type = this.accepts('html', 'json');
        if (type == 'json') {
            this.body = {
                error: this.body
            };
        }
    }


});

app.use(function*(next) {
// nested path
    let pathname = decodeURI(url.parse(this.url).pathname);
    let filename = pathname.slice(1); // /file.ext -> file.ext

    if (filename.includes('/') || filename.includes('..')) {
        console.log('nested' + pathname + ' '+ filename);
        this.status = 400;
        this.body = "Nested paths are not allowed";
        return;
    }
    yield* next;
});

router
    .get('/', function* (next) {
        console.log('get simple');
        let html = yield fs.readFile(config.get('publicRoot') + '/index.html', 'utf8');
        this.body = html;
    })

    .get('/:file', function *(next) {
        console.log('get /file');
        let file = this.params.file;
        let filePath = path.join(config.get('filesRoot'), file);
        this.body = fs.createReadStream(filePath);
    })
    .post('/:file', function *(next) {

        let res = this.res;
        let fileName = this.params.file;
        let file = path.join(config.get('filesRoot'), fileName)


        let size = 0;   

        let writeStream = fs.createWriteStream(file, {flags: 'wx'});

        yield new Promise((resolve, reject) => {

            writeStream
                //.on('finish', () => console.log('finish', res.statusCode, res.headersSent))
                .on('error', err => {
                    if (err.code == 'EEXIST') {
                        reject(createError(409));
                    } else {
                        console.error(err);
                        fs.unlink(file, err => {/*ignore*/});

                        reject(createError(500));
                    }
                })
                .on('close', resolve);

            this.req
                .on('data', function(chunk) {
                    size += chunk.length;
                    //console.log('chunk', size, config.get('limitFileSize'));

                    if (size > config.get('limitFileSize')) {
                        fs.unlink(file, err => {/*ignore*/});
                        writeStream.destroy();
                        reject(createError(413));
                    }})
                .pipe(writeStream);


        });

        this.body = 'OK';
    })
    .del('/:file', function*(next) {
        console.log('del');
        let filename = this.params.file;
        let filePath = path.join(config.get('filesRoot'), filename);
        try {
            yield fs.unlink(filePath);
        } catch(err) {
            if (err.code == 'ENOENT') {
                this.throw(404);
            } else {
                throw err;
            }
        }
        this.body = 'OK';
    });

app.use(
    router.routes()
);




module.exports = app;
