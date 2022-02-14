const { writeFile, readFile, readdir } = require('fs/promises');
const path = require('path');
//const { allowedNodeEnvironmentFlags } = require('process');
const shortid = require('shortid');
//get(id) not found
//get(all)
//delete(id) stretch
class SimpleDb {
  constructor(dirPath) {
    this.dirPath = dirPath;
  }
  get(id) {
    const newFile = `${id}.txt`;
    this.file = path.join(this.dirPath, newFile);
    const parsedFile = readFile(this.file, 'utf-8').then((file) =>
      JSON.parse(file)
    );
    return parsedFile.catch((error) => {
      if (error.code === 'ENOENT') {
        return null;
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
}
module.exports = SimpleDb;
