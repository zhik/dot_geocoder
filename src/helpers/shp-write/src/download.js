var zip = require('./zip');
var saveAs = require('file-saver').saveAs;

//fix to about:blank#blocked provided by Miroko https://github.com/mapbox/shp-write/pull/50

module.exports = function(gj, options) {
    zip(gj, options).then(function(blob) { 
        saveAs(blob, options.fileName + '.zip'); 
    });
};
