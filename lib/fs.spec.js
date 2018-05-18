jest.mock('fs');
const fs = require('fs');

const { read, write } = require('./fs');

describe('fs', () => {
  beforeEach(() => {
    fs.readFile.mockReset();
    fs.writeFile.mockReset();
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
