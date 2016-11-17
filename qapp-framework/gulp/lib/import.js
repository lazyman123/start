var through = require('through2'),
    request = require('request'),
    async = require('async'),
    fs = require('fs'),
    md5 = require('md5');

var cache = {};

module.exports = function() {
    return through.obj(function(file, enc, cb) {
        var contents = file.contents.toString(enc),
            importList = [];
        contents.replace(/([ \t]+)@import\s\"([^\"]+)\"*/g, function(a, b, c, d) {
            importList.push({
                space: b,
                url: c
            })
            return a;
        });
        async.series(importList.map(function(item) {
            return function(callback) {
                if (cache[item.url]) {
                    contents = contents.replace('@import "' + item.url + '"', cache[item.url].replace(/\n/g, '\n' + item.space));
                    callback();
                } else if (fs.existsSync('.cache/' + md5(item.url))) {
                    var body = fs.readFileSync('.cache/' + md5(item.url), 'utf-8');
                    cache[item.url] = body;
                    contents = contents.replace('@import "' + item.url + '"', body.replace(/\n/g, '\n' + item.space));
                    callback();
                } else {
                    request(item.url, function(error, response, body) {
                        if (!error && response.statusCode == 200) {
                            cache[item.url] = body;
                            fs.writeFileSync('.cache/' + md5(item.url), body, 'utf-8');
                            contents = contents.replace('@import "' + item.url + '"', body.replace(/\n/g, '\n' + item.space));
                        }
                        callback();
                    });
                }
            };
        }), function() {
            file.contents = new Buffer(contents);
            cb(null, file);
        });
    });
};
