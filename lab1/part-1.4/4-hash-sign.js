var fs = require('fs');
var crypto = require('crypto');
var md5 = require('md5');

const sign = crypto.createSign('RSA-SHA256');
const verify = crypto.createVerify('RSA-SHA256');

const pem = fs.readFileSync('dsa_priv.pem');
const privateKey = pem.toString('ascii');

const pub = fs.readFileSync('dsa_pub.pem');
const publicKey = pub.toString('ascii');

if (process.argv[2] === '--sign') {
	fs.readFile('input.txt', function(err, buf) {
		console.log(md5(buf));
		sign.update(md5(buf));
		console.log(sign.sign(privateKey, 'hex'));
	});
}

if (process.argv[2] === '--verify') {
	fs.readFile('input.txt', function(err, buf) {
		console.log(md5(buf));
		verify.update(md5(buf));
		console.log(verify.verify(publicKey, '302d021468932fed7428c628840ba5b61deb03612644b6eb02150098fcf321ab585ce25b9c7961c56798aa4605ab49', 'hex'));
	});
}