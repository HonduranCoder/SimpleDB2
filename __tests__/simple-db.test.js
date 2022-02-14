const fs = require('fs/promises');
const path = require('path');
const SimpleDb = require('../lib/simple-db.js');

//check this later (CI)
const { CI, HOME } = process.env;
const BASE_DIR = CI ? HOME : __dirname;
const TEST_DIR = path.join(BASE_DIR, 'test-dir');

describe('simple database', () => {
  beforeEach(async () => {
    await fs.rm(TEST_DIR, { force: true, recursive: true });
    await fs.mkdir(TEST_DIR, { recursive: true });
  });
  //^ setting things up but just different syntax
  it('gets by id', async () => {
    //every time we do a test
    const firstDb = new SimpleDb(TEST_DIR);
    const newFile = {
      id: '1',
      content: 'new file',
    };

    const filePath = path.join(TEST_DIR, `${newFile.id}.txt`);
    //writing the file
    await fs.writeFile(filePath, JSON.stringify(newFile));
    //checking the get(id) returns the file, we want the value
    expect(await firstDb.get(newFile.id)).toEqual(newFile);
  });
});
