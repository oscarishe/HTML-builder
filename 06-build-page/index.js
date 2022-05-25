const fs = require('fs');
const { resolve } = require('path');
var path = require('path');
let folder = path.join(__dirname,'assets');
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
      fs.unlink(path.join(direct, file.name), err => {
        if (err) throw err;
      });
    }
    if(file.isDirectory()) {
      clearDirectory(path.join(direct,file.name));
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
            fs.stat(path.join(direct,file.name), (error, stats) => {
            if (error) {
                console.log(error);
            }
            else {            
                if(file.isDirectory()) {
                     createDirectory(path.join(distDirect,file.name));  
                     copyFolder(path.join(direct,file.name), path.join(distDirect,file.name));
                }
              if(file.isFile()) {   
                fs.copyFile(path.join(direct,file.name), path.join(distDirect,file.name), (err) => {
                    if (err) throw err;
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
                      }
                    }); 
                  }
                }
              });
            });
          }
        });
};
const deleteFolders = async() => {
  let folders = await fs.promises.readdir(path.join(projectDist,'assets'), {withFileTypes:true});
  folders = folders.filter(item=> {
      if(item.isDirectory())
      return item;
  });
  for (let item of folders) {
    let isDeletable = false;
    await fs.promises.access(path.join(folder,item.name))
    .then(()=> {})
    .catch(()=> {
      isDeletable=true;
    });
    if(isDeletable)
    await fs.promises.rm(path.join(projectDist,'assets',item.name),{recursive:true});
  }
};
const renderPages = async () => {
 
  let components = await fs.promises.readdir(path.join(__dirname,'components'));
  components = components.filter((file)=> {return file.split('.').pop()==='html';});
  let template = await fs.promises.readFile(path.join(__dirname,'template.html'),'utf-8');
  await fs.promises.writeFile(path.join(__dirname, 'project-dist', 'index.html'),template);
  for (let file of components) {
    let component = await fs.promises.readFile(path.join(__dirname, 'components', file), 'utf-8');
    let index = await fs.promises.readFile(path.join(projectDist, 'index.html'), 'utf-8');
    let newIndex = index.replace(`{{${file.split('.')[0]}}}`, component);
    await fs.promises.writeFile(path.join(projectDist, 'index.html'), newIndex);
  }
};
const promise = new Promise((resolve) => {
  createDirectory(projectDist);
  resolve();
});
promise.then(()=> {
  createDirectory(path.join(projectDist,'assets'));
  resolve();
}).then(()=> {
  clearDirectory(projectDist);
  resolve();
}).then(()=> {
  copyFolder(folder,path.join(projectDist,'assets'));
  console.log('Папка assets скопирована');
  resolve();
}).then(()=> {
  createFile('style.css');
  resolve();
}).then(()=> {
  mergeStyle();
  console.log('Стили объединены в bundle.css');
  resolve();
}).then(()=> {
  renderPages();
  console.log('index.html сформирован');
  resolve();
}).then(() => {
  deleteFolders();
});