const fs = require('fs');
const { resolve } = require('path');
const path = require('path');
let currentFolder = path.join(__dirname,'styles');
let newFolder = path.join(__dirname,'project-dist');
console.log(currentFolder);
const promise = new Promise((resolve)=> {
  fs.writeFile(path.join(newFolder,'bundle.css'), '', (err) => {
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
          fs.stat(path.join(currentFolder,file.name), (error) => {
            if (error) {
              console.log(error);
            }
            else {            
              if(path.extname(file.name)=='.css') {
                let readStream = fs.createReadStream(path.join(currentFolder,file.name), {encoding: 'utf-8'});
                readStream.on('readable', () => {
                  let text = readStream.read();
                  if(text!==null) { fs.appendFile(path.join(newFolder,'bundle.css'), text, function(error){
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