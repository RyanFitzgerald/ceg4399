const fs = require('fs');
const crypto = require('crypto');
const key = crypto.randomBytes(32).toString('hex');

if (process.argv[2] === '--encrypt') {
	const cipher = crypto.createCipher('aes192', key);

	const input = fs.createReadStream('input.txt');
	const output = fs.createWriteStream('encrypted.enc');
	input.pipe(cipher).pipe(output);
    console.log('The file was encrypted!');
	console.log('The key used was: ' + key);
}

if (process.argv[2] === '--decrypt') {
	const decipher = crypto.createDecipher('aes192', process.argv[3]);

	const input = fs.createReadStream('encrypted.enc');
	const output = fs.createWriteStream('input-decrypted.txt');

	input.pipe(decipher).pipe(output);
    
    console.log('The file was decrypted!');
}