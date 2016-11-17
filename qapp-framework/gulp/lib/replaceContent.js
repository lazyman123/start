var through = require('through2');
var dateFormat = require('date-format');

module.exports = function(version) {
    return through.obj(function(file, enc, cb) {
        var contents = file.contents.toString(enc).
            replace(/\*Version\*/g, version).
            replace(/\*Date\*/g, dateFormat('yyyy-MM-dd', new Date())).
            replace(/\n/g, '\n\t');
            
        file.contents = new Buffer('(function(){\n\n\t"use strict";\n\n\t' + contents + '\n\n})();');
        cb(null, file);
    });
};
