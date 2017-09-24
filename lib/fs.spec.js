jest.mock('fs');
jest.mock('find-up');

const fs = require('fs');
const findup = require('find-up');

const { find, read, write } = require('./fs');

describe('fs', () => {
  beforeEach(() => {
    fs.readFile.mockReset();
    fs.writeFile.mockReset();
    findup.mockReset();
  });

  describe('find', () => {
    it('looks up the directory tree for a given file', async () => {
      expect.assertions(2);
      findup.mockReturnValue(Promise.resolve('foundpath'));

      const result = await find('file', 'dir');
      expect(result).toEqual('foundpath');
      expect(findup).toHaveBeenCalledWith('file', { cwd: 'dir' });
    });

    it('throws an error if it cannot find the file', async () => {
      expect.assertions(1);
      findup.mockReturnValue(Promise.resolve());

      try {
        await find('file');
      } catch (err) {
        expect(err).toBeInstanceOf(Error);
      }
    });
  });

  describe('read', () => {
    beforeEach(() => {
      fs.readFile.mockImplementation((file, options, cb) =>
        cb(undefined, 'content')
      );
    });

    it('wraps the method in a promise', async () => {
      expect.assertions(2);
      const args = ['file', { encoding: 'utf8' }];
      const outcome = await read(...args);
      expect(outcome).toEqual('content');
      expect(fs.readFile).toHaveBeenCalledWith(...args, expect.any(Function));
    });
  });

  describe('write', () => {
    beforeEach(() => {
      fs.writeFile.mockImplementation((file, content, options, cb) =>
        cb(undefined, 'content')
      );
    });

    it('wraps the method in a promise', async () => {
      expect.assertions(2);
      const args = ['file', 'content', { encoding: 'utf8' }];
      const outcome = await write(...args);
      expect(outcome).toEqual('content');
      expect(fs.writeFile).toHaveBeenCalledWith(...args, expect.any(Function));
    });
  });
});
