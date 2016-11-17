var fs = require('fs');
var JSON5 = require('json5');

module.exports = {
    read: function(path) {
        return JSON5.parse(fs.readFileSync(path, 'UTF-8'));
    },
    write: function(path, json) {
        fs.writeFileSync(path, JSON.stringify(json, {}, 4), 'UTF-8');
    }
};
