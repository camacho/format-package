jest.mock('fs');
jest.mock('path');
jest.mock('findup');

const findup = require('findup');
const path = require('path');

const { find } = require('./fs');

describe('fs', () => {
  beforeEach(() => {
    findup.sync.mockReset();
    path.join.mockReset();
  });

  describe('find', () => {
    it('looks up the directory tree for a given file', () => {
      findup.sync.mockReturnValue('foundpath');
      path.join.mockReturnValue('joined path');

      expect(find('file', 'dir')).toEqual('joined path');
      expect(findup.sync).toHaveBeenCalledWith('dir', 'file');
      expect(path.join).toHaveBeenCalledWith('foundpath', 'file');
    });

    it('throws an error if it cannot find the file', () => {
      findup.sync.mockImplementation(() => {
        throw new Error('Not found');
      });
      expect(() => find('file')).toThrow();
    });
  });
});
