const fs = require('fs');
let signatures = [];

/*
 * Scans a provided directory for files
 */ 
function scanDirectory(dirname) {
  fs.readdir(dirname, function(err, files) {
    // If error, log it and stop
    if (err) {
      console.log(`Error: ${err}`);
      return;
    }

    // Iterate over the files in the directory
    files.forEach(file => {      
      fs.readFile(`${dirname}\\${file}`, (err, content) => {
        // If error, log it and stop
        if (err) {
          console.log(`Error: ${err}`);
          return;
        }

        // Print start message
        console.log(`--- Start Scanning File: ${file} ---`);

        let virus = false;
        let virusSignature = '';

        // Check for matching signature
        signatures.forEach(signature => {
          if (content.includes(signature)) {
            virus = true;
            virusSignature = signature.toString().substring(0, 8);
          }
        });

        // There is a virus, do something
        if (virus) {
          // Log virus found
          console.log(`!!! Virus Found in file: ${file}, rendered inactive !!!`);

          // Render virus inactive
          const result = content.toString().replace(new RegExp(virusSignature, 'g'), 'xxxxxxxx');

          // Write the new file back
          fs.writeFile(`${dirname}\\${file}`, result, (err) => {
            if (err) {
              console.log(err);
              return
            }
          });

          // Quarantine it to the folder
          console.log(`!!! File quarantined in folder 'quarantine' !!!`);
          fs.rename(`${dirname}\\${file}`, `quarantine\\${file}`, err => {
            if (err) {
              console.log(err);
              return;
            }
          });  
        }

        // Print end message
        console.log(`--- Done Scanning File: ${file} ---`);
        console.log('\n');
      });
    });
  });
}

// Get signatures and remove last empty string
const signaturesRaw = fs.readFileSync('Signature.DAT').toString().split('\n');
signaturesRaw.splice(-1,1)

// Get byte buffers for each signature
signatures = signaturesRaw.map(val => Buffer.from(val, 'utf-8'));

// Scan the provided directory
scanDirectory('files');