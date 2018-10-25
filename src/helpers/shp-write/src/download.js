var zip = require('./zip');

//To-do: add error case for JSZip fail redirect for download
module.exports = function(gj, options) {
    var content = zip(gj, options);
    window.location.href = 'data:application/zip;base64,' + content; 
};
