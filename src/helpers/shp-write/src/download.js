var zip = require('./zip');

//To-do: add error case for JSZip fail redirect for download
module.exports = function(gj, options) {
    var content = zip(gj, options);
    window.location.href = 'data:application/zip;base64,' + content; //The current URL length limit in chrome is 2097152 characters
};
