const fs = require('fs/promises');
const path = require('path');
const shortid = require('shortid');
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
  it('gives a bad file error', async () => {
    const firstDb = new SimpleDb(TEST_DIR);
    const newFile = {
      id: '1',
      content: 'new file',
    };
    fs.writeFile(TEST_DIR + 1 + 'txt', JSON.stringify(newFile));
    const result = await firstDb.get(1);
    expect(result.message).toEqual('Not Found');
  });
  it('saves an object id, assigns an id, and serializes the object', async () => {
    const firstDb = new SimpleDb(TEST_DIR);
    const newObject = {
      name: 'new',
      text: 'random',
    };
    return await firstDb
      .save(newObject)
      .then(() => expect(newObject.id).toEqual(expect.any(String)));
  });
  it('should return all files', () => {
    const simpleDB = new SimpleDb(TEST_DIR);
    const firsNew = { text: 'first' };
    const secondOld = { text: 'second' };
    const expectation = [
      {
        id: expect.any(String),
        text: expect.any(String),
      },
      {
        id: expect.any(String),
        text: expect.any(String),
      },
    ];

    return simpleDB
      .save(firsNew)
      .then(() => simpleDB.save(secondOld))
      .then(() => simpleDB.getAll())
      .then((files) => expect(files).toEqual(expectation));
  });
});
