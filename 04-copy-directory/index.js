const fs = require('fs');
const { resolve } = require('path');
const path = require('path');
let copyFolder = path.join(__dirname,'files');
let newFolder = path.join(__dirname,'files-copy');

const createDirectory = () => {
  fs.mkdir(path.join(__dirname, 'files-copy'),
    { recursive: true }, (err) => {
      if (err) {
        return console.error(err);
      }
    });
};
const clearDirectory = () => {
  fs.readdir(newFolder, (err, files) => {
    if (err) throw err;
  
    for (const file of files) {
      fs.unlink(path.join(newFolder, file), err => {
        if (err) throw err;
      });
    }
  });
};
const rewriteDirectory = () => {
  fs.readdir(copyFolder, (err, files) => {
    if (err)
      console.log(err);
    else {
      files.forEach(file => {
        fs.copyFile(path.join(copyFolder,file), path.join(newFolder,file), (err) => {
          if (err) throw err;
          console.log(`${file} успешно скопирован`);
        });
      });
    }
  });
};
const promise = new Promise((resolve) => {
  createDirectory();
  resolve();
}
);
promise.then( () => {
  clearDirectory();
  resolve();
}
).then (()=> {
  rewriteDirectory();
  resolve();
});