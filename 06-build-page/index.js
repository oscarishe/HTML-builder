const fs = require('fs');
const { resolve } = require('path');
var path = require('path');
let folder = __dirname+'\\assets\\';
let projectDist = path.join(__dirname, 'project-dist');
let stylesDist = path.join(__dirname,'styles');
const readline = require('readline'); 
const readInterface = readline.createInterface({ 
    input: fs.createReadStream(path.join(__dirname,'template.html'))
    }); 
const deleteDirectory = () => {
    fs.rm(projectDist, {
        recursive: true,
      }, (error) => {
        if (error) {
          console.log(error);
        }
      });
}
const createDirectory = (direct) => {
  fs.mkdir(direct,
    { recursive: true }, (err) => {
      if (err) {
        return console.error(err);
      }
    });
};
const clearDirectory = (direct) => {
    fs.readdir(direct,
        { withFileTypes: true }, 
        (err, files) => {
      if (err) throw err;
      else 
            files.forEach(file =>{
                if(file.isFile()) {
        fs.unlink(path.join(direct, file), err => {
          if (err) throw err;
        });
      }
      if(file.isDirectory()) {
        fs.rm(path.join(direct, file), {
            recursive: true,
          }, (error) => {
            if (error) {
              console.log(error);
            }
          });
    }
            });
    });
  };
const copyFolder = (direct, distDirect) => {
    fs.readdir(direct, 
    { withFileTypes: true },
    (err, files) => {
        if (err)
        console.log(err);
        else {
        files.forEach(file => {
            fs.stat(direct+file.name, (error, stats) => {
            if (error) {
                console.log(error);
            }
            else {            
                if(file.isDirectory()) {
                     createDirectory(path.join(projectDist,file.name),);  
                     copyFolder(`${direct}//${file.name}//`, path.join(distDirect,file.name));
                }
              if(file.isFile()) {   
                fs.copyFile(path.join(direct,file.name), path.join(distDirect,file.name), (err) => {
                    if (err) throw err;
                    // console.log(`${file.name} успешно скопирован`);
                  });
                
                }
            }
            });
        });
        }
    });
};
const createFile = (filename) => {
    fs.writeFile(path.join(projectDist, filename), '', (err) => {
        if (err)
          console.log(err);
      });
}
const mergeStyle = () => {
    fs.readdir(stylesDist, 
        { withFileTypes: true },
        (err, files) => {
          if (err)
            console.log(err);
          else {
            files.forEach(file => {
              fs.stat(path.join(stylesDist,file.name), (error) => {
                if (error) {
                  console.log(error);
                }
                else {            
                  if(path.extname(file.name)=='.css') {
                    let readStream = fs.createReadStream(path.join(stylesDist,file.name), {encoding: 'utf-8'});
                    readStream.on('readable', () => {
                      let text = readStream.read();
                      if(text!==null) { fs.appendFile(path.join(projectDist,'style.css'), text, function(error){
                        if(error) throw error; 
                      });
                    //   console.log(file.name + ' скопирован');
                      }
                    }); 
                  }
                }
              });
            });
          }
        });
}

const promise = new Promise((resolve) => {
  createDirectory(projectDist);
  resolve();
});
promise.then(()=> {
  copyFolder(folder,projectDist);
  resolve();
}).then(()=> {
  createFile('style.css');
  resolve();
}).then(()=> {
  mergeStyle();
  resolve();
}).then(()=> {
  createFile('index.html');
  resolve();
});