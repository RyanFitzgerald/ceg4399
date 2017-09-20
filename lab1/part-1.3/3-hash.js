const fs = require('fs');
const crypto = require('crypto');
const md5 = require('md5');

if (process.argv[2] === '--send') {
    fs.readFile('input.txt', function(err, buf) {
        console.log(`The generated hash for the provided file is: ${md5(buf)}`);
    });
}

if (process.argv[2] === '--receive') {
    fs.readFile('input.txt', function(err, buf) {
        const received = process.argv[3];
        const hash = md5(buf);
        console.log(`The provided sender hash is: ${received}`);
        console.log(`The generated hash for the provided file is: ${hash}`);
        if (received === hash) {
            console.log('The sender hash EQUALS the receiver generated hash.');
        } else {
            console.log('The sender hash DOES NOT EQUAL the receiver generated hash.');
        }
    });
}


