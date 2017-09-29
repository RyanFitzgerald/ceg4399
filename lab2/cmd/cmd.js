const crypto = require('crypto');
const fs = require('fs');

if (process.argv[2] === '--send') {
  const authKey = process.argv[3] || false;
  const confKey = process.argv[4] || false;

  if (!authKey) {
    console.error('Error: You must provide an authenticity key!');
    return;
  }

  const hmac = crypto.createHmac('sha256', authKey);

  fs.readFile('input.txt', function (err, data ) {
    let fileContent = data;

    if (confKey) {
      const cipher = crypto.createCipher('aes192', confKey);
      fileContent = cipher.update(fileContent, 'utf8', 'hex');
      fileContent += cipher.final('hex');
      fs.writeFile('output.enc', fileContent, (err) => {
        if (err) throw err;
        console.log('ENCRYPTED FILE CREATED.');
      });
    }

    hmac.update(fileContent);
    console.log(`HMAC: ${hmac.digest('hex')}`);
  });
} else if (process.argv[2] === '--receive') {
  const authKey = process.argv[3] || false;
  const hmacResult = process.argv[4] || false;

  if (!authKey || !hmacResult) {
    console.error('Error: You must provide an authenticity key and HMAC result!');
    return;
  }

  const hmac = crypto.createHmac('sha256', authKey);

  fs.readFile('input.txt', function (err, data ) {
    let fileContent = data;
    hmac.update(fileContent);
    const newHmac = hmac.digest('hex');
    console.log(`Provided HMAC: ${hmacResult}`);
    console.log(`Generated HMAC: ${newHmac}`);
    if (hmacResult == newHmac) {
      console.log('HMACs match, file is authentic.');
    } else {
      console.log('HMACs do not match, cannot gaurantee authenticity of file.');
    }
  });
} else if (process.argv[2] === '--receive-encrypted') {
  const authKey = process.argv[3] || false;
  const confKey = process.argv[4] || false;  
  const hmacResult = process.argv[5] || false;

  if (!authKey || !confKey || !hmacResult) {
    console.error('Error: You must provide an authenticity key, encryption key, and HMAC result!');
    return;
  }

  const hmac = crypto.createHmac('sha256', authKey);

  fs.readFile('output.enc', function (err, data ) {
    let fileContent = data;
    let fileContentString = fileContent.toString();

    hmac.update(fileContent);
    const newHmac = hmac.digest('hex');
    console.log(`Provided HMAC: ${hmacResult}`);
    console.log(`Generated HMAC: ${newHmac}`);
    if (hmacResult == newHmac) {
      console.log('HMACs match, file is authentic.');
    } else {
      console.log('HMACs do not match, cannot gaurantee authenticity of file.');
    }

    const decipher = crypto.createDecipher('aes192', confKey);

    try {
      fileContentString = fileContentString.toString('hex');
      fileContentString = decipher.update(fileContentString, 'hex', 'utf8');
      fileContentString += decipher.final('utf8');

      fs.writeFile('input-decrypted.txt', fileContentString, (err) => {
        if (err) throw err;
        console.log('FILE DECRYPTED.');
      });
    } catch(err) {
      console.error('Error: File cannot be decrypted!');
      throw err;
    }
  });  
} else { 
  console.error('Error: Invalid arguments. Please use --send or --receive.');
}
