const { writeFile, readFile, readdir } = require('fs/promises');
const path = require('path');
//const { allowedNodeEnvironmentFlags } = require('process');
const shortid = require('shortid');
//delete(id) stretch
class SimpleDb {
  constructor(dirPath) {
    this.dirPath = dirPath;
  }
  get(id) {
    const newFile = `${id}.json`;
    this.file = path.join(this.dirPath, newFile);
    const parsedFile = readFile(this.file, 'utf-8').then((file) =>
      JSON.parse(file)
    );
    return parsedFile.catch((error) => {
      if (error.code === 'ENOENT') {
        return new Error('Not Found');
      }
      throw error;
    });
  }
  save(newObject) {
    const newId = shortid.generate();
    newObject.id = newId;
    const newFile = `${newId}.json`;
    this.newFolder = path.join(this.dirPath, newFile);
    const stringObj = JSON.stringify(newObject);
    return writeFile(this.newFolder, stringObj);
  }
  getAll() {
    //get all file names from readdir
    return readdir(this.dirPath).then((fileNames) => {
      console.log(fileNames);
      return Promise.all(
        fileNames.map((name) => {
          //returning array of parsed file content
          console.log(name.split('.')[0]);
          return this.get(name.split('.')[0]);
        })
      );
    });
  }
}
module.exports = SimpleDb;
