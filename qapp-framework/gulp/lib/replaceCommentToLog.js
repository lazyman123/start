var through = require('through2');

module.exports = function() {
    return through.obj(function(file, enc, cb) {
        file.contents = new Buffer(file.contents.toString(enc).replace(/\/\/(INFO|DEBUG|WARN|ERROR)(.+)\n/g, function(a, b, c) {
            return '_logger.' + b.toLowerCase() + '(' + c + ');\n';
        }));
        cb(null, file);
    });
};
