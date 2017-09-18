var fs = require('fs');
var crypto = require('crypto');
var md5 = require('md5');

fs.readFile('input.txt', function(err, buf) {
    console.log(md5(buf));
});


