jest.mock('fs-extra', () => {
  const fsExtra = require.requireActual('fs-extra');
  jest.spyOn(fsExtra, 'writeFile').mockImplementation(() => {});
  return fsExtra;
});

const fs = require('fs-extra');
const path = require('path');

const fixtures = require('glob').sync('*.json', {
  absolute: false,
  cwd: __dirname,
});

const { execute } = require('../../cli');

describe('Fixtures', () => {
  const processExit = process.exit;

  beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(v => v);
    jest.spyOn(console, 'error').mockImplementation(v => v);
    Object.defineProperty(process, 'exit', { value: jest.fn() });
  });

  beforeEach(async () => {
    console.log.mockClear();
    console.error.mockClear();
    fs.writeFile.mockClear();
    process.exit.mockClear();
  });

  afterAll(() => {
    Object.defineProperty(process, 'exit', processExit);
    console.error.mockRestore();
    console.log.mockRestore();
  });

  describe.each(fixtures)(`Formatting "%s"`, filename => {
    const filepath = path.join(__dirname, filename);
    it(`produces an expected output`, async () => {
      expect.assertions(3);

      await execute([filepath, '-w']);

      expect(fs.writeFile).toHaveBeenCalledTimes(1);
      expect(fs.writeFile.mock.calls[0][0]).toEqual(filepath);
      expect(fs.writeFile.mock.calls[0][1]).toMatchSnapshot(filename);
    });

    it(`does not throw an error`, async () => {
      expect.assertions(2);
      await execute([filepath]);
      expect(console.error).not.toHaveBeenCalled();
      expect(process.exit).not.toHaveBeenCalled();
    });
  });
});
