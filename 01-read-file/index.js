const fs = require('fs');
let filename = __dirname + '\\text.txt';
let readStream = fs.createReadStream(filename, {encoding: 'utf-8'});
readStream.on('readable', () => {
  let text = readStream.read();
  if(text!==null) console.log(text);
});