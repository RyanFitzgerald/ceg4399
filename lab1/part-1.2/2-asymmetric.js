const crypto = require("crypto");
const path = require("path");
const fs = require("fs");

const publicPath = path.resolve('pubkey.pem');
const publicKey = fs.readFileSync(publicPath, "utf8");

const privatePath = path.resolve('privkey.pem');
const privateKey = fs.readFileSync(privatePath, "utf8");

if (process.argv[2] === '--encrypt') {
	fs.readFile('input.txt', function(err, buffer) {
		const encrypted = crypto.publicEncrypt(publicKey, buffer);
		fs.writeFile('encrypted.enc', encrypted, (err) => {
			if (err) throw err;
			console.log('The file has been encrypted!');
		});
	});
}

if (process.argv[2] === '--decrypt') {
	fs.readFile('encrypted.enc', function(err, buffer) {
		const decrypted = crypto.privateDecrypt(privateKey, buffer);
		fs.writeFile('input-decrypted.txt', decrypted, (err) => {
			if (err) throw err;
			console.log('The file has been decrypted!');
		});
	});
}