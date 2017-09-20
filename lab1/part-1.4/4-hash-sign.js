const fs = require('fs');
const crypto = require('crypto');
const md5 = require('md5');

const sign = crypto.createSign('RSA-SHA256');
const verify = crypto.createVerify('RSA-SHA256');

const pem = fs.readFileSync('dsa_priv.pem');
const privateKey = pem.toString('ascii');

const pub = fs.readFileSync('dsa_pub.pem');
const publicKey = pub.toString('ascii');

if (process.argv[2] === '--sign') {
	fs.readFile('input.txt', function(err, buf) {
		console.log(`The generated hash is: ${md5(buf)}`);
		sign.update(md5(buf));
		console.log(`The generated hash signature is: ${sign.sign(privateKey, 'hex')}`);
	});
}

if (process.argv[2] === '--verify') {
	fs.readFile('input.txt', function(err, buf) {
		console.log(`The generated hash is: ${md5(buf)}`);
        console.log(`The provided hash signature is: ${process.argv[3]}`);
		verify.update(md5(buf));
		console.log(`Signature Verification: ${verify.verify(publicKey, process.argv[3], 'hex')}`);
	});
}