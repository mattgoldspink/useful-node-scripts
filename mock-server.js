var http = require('http');
var fs = require('fs');
var path = require('path');

http.createServer(function (request, response) {

    console.log('request starting...');

    var filePath = '.' + request.url;
    if (/\/$/.test(filePath)) {
        filePath += 'index.html';
    }

    var extname = path.extname(filePath);
    var contentType;
    switch (extname) {
        case '.html':
            contentType = 'text/html';
            break;
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.png':
            contentType = 'text/png';
            break;
        default:
            contentType = 'application/json';
    }
    console.log('    trying ' + filePath);

    fs.exists(filePath, function(exists) {

        if (exists) {
            fs.readFile(filePath, function(error, content) {
                if (error) {
                    response.writeHead(500);
                    response.end();
                }
                else {
                    response.writeHead(200, { 'Content-Type': contentType });
                    response.end(content, 'utf-8');
                }
            });
        } else {
            // try for a mock server response instead
            filePath = './mockdata' + request.url.replace(/\?.*/, '');
            console.log('    trying ' + filePath);
            fs.exists(filePath, function(exists) {
                if (exists) {
                    fs.readFile(filePath, function(error, content) {
                        if (error) {
                            response.writeHead(500);
                            response.end();
                        }
                        else {
                            response.writeHead(200, { 'Content-Type': contentType });
                            response.end(content, 'utf-8');
                        }
                    });
                } else {
                    response.writeHead(404);
                    response.end();
                }
            });
        }
    });

}).listen(3128);

console.log('Server running at http://127.0.0.1:3128/');
