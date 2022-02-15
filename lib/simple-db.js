const { writeFile, readFile, readdir } = require('fs/promises');
const path = require('path');
//const { allowedNodeEnvironmentFlags } = require('process');
const shortid = require('shortid');
//delete(id) stretch
class SimpleDb {
  constructor(dirPath) {
    this.dirPath = dirPath;
  }
  async get(id) {
    try {
      const newFile = `${id}.json`;
      this.file = path.join(this.dirPath, newFile);
      const parsedFile = await readFile(this.file, 'utf-8');
      return JSON.parse(parsedFile);
    } catch (error) {
      if (error.code === 'ENOENT') {
        return new Error('Not Found');
      }
      throw error;
    }
  }

  save(newObject) {
    const newId = shortid.generate();
    newObject.id = newId;
    const newFile = `${newId}.json`;
    this.newFolder = path.join(this.dirPath, newFile);
    const stringObj = JSON.stringify(newObject);
    return writeFile(this.newFolder, stringObj);
  }

  async getAll() {
    //get all file names from readdir
    const allFiles = await readdir(this.dirPath);
    return Promise.all(
      //returning array of parsed file content
      allFiles.map((name) => this.get(name.split('.')[0]))
    );
  }
}
module.exports = SimpleDb;
