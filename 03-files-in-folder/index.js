const fs = require('fs');
var path = require('path');
let folder = path.join(__dirname,'secret-folder');
fs.readdir(folder, 
  { withFileTypes: true },
  (err, files) => {
    console.log('\nФайлы директории:');
    if (err)
      console.log(err);
    else {
      files.forEach(file => {
        fs.stat(path.join(folder,file.name), (error, stats) => {
          if (error) {
            console.log(error);
          }
          else {            
            if(stats.isFile()) console.log(`${file.name.slice(0,file.name.lastIndexOf('.'))} - ${path.extname(file.name)} - ${(stats.size/1024).toFixed(3)} kb`);
          }
        });
      });
    }
  });