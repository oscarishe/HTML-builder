const fs = require('fs');
const { resolve } = require('path');
const path = require('path');
let currentFolder = __dirname + '\\styles\\';
let newFolder = __dirname + '\\project-dist\\';
console.log(currentFolder);
const promise = new Promise((resolve)=> {
  fs.writeFile(newFolder+'bundle.css', '', (err) => {
    if (err)
      console.log(err);
  });
  resolve();
});
promise.then(() => {
  fs.readdir(currentFolder, 
    { withFileTypes: true },
    (err, files) => {
      console.log('\nФайлы директории:');
      if (err)
        console.log(err);
      else {
        files.forEach(file => {
          fs.stat(currentFolder+file.name, (error) => {
            if (error) {
              console.log(error);
            }
            else {            
              if(path.extname(file.name)=='.css') {
                let readStream = fs.createReadStream(currentFolder+file.name, {encoding: 'utf-8'});
                readStream.on('readable', () => {
                  let text = readStream.read();
                  if(text!==null) { fs.appendFile(newFolder+'bundle.css', text, function(error){
                    if(error) throw error; 
                  });
                  console.log(file.name + ' скопирован');
                  }
                }); 
              }
            }
          });
        });
      }
    });
  resolve();
});