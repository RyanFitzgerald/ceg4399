var crypto = require("crypto");
var path = require("path");
var fs = require("fs");


var publicPath = path.resolve('pubkey.pem');
var publicKey = fs.readFileSync(publicPath, "utf8");

var privatePath = path.resolve('privkey.pem');
var privateKey = fs.readFileSync(privatePath, "utf8");

if (process.argv[2] === '--encrypt') {
	fs.readFile('input.txt', function(err, buffer) {
		var encrypted = crypto.publicEncrypt(publicKey, buffer);
		fs.writeFile('encrypted.enc', encrypted, (err) => {
			if (err) throw err;
			console.log('The file has been encrypted!');
		});
	});
}

if (process.argv[2] === '--decrypt') {
	fs.readFile('encrypted.enc', function(err, buffer) {
		var decrypted = crypto.privateDecrypt(privateKey, buffer);
		fs.writeFile('input-decrypted.txt', decrypted, (err) => {
			if (err) throw err;
			console.log('The file has been decrypted!');
		});
	});
}