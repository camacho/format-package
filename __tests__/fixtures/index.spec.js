const fs = require('fs');
const path = require('path');
const glob = require('glob');

const execute = require('../../lib/cli');

const fixtures = glob.sync('**/**.json', {
  absolute: true,
  cwd: __dirname,
});

describe('Fixtures', () => {
  const processExit = process.exit;

  beforeEach(async () => {
    jest.spyOn(fs, 'writeFile');
    jest.spyOn(console, 'error');
    jest.spyOn(console, 'log');
    console.log.mockImplementation(v => v);
    console.error.mockImplementation(v => v);
    Object.defineProperty(process, 'exit', { value: jest.fn() });
  });

  afterEach(() => {
    Object.defineProperty(process, 'exit', processExit);
    fs.writeFile.mockRestore();
    console.error.mockRestore();
    console.log.mockRestore();
  });

  fixtures.forEach(fixture => {
    const filename = path.relative(__dirname, fixture);

    describe(`Formatting ${filename}`, () => {
      it(`produces an expected output`, async () => {
        expect.assertions(3);

        await execute([fixture, '-w'], __dirname);

        expect(fs.writeFile).toHaveBeenCalledTimes(1);
        expect(fs.writeFile.mock.calls[0][0]).toEqual(fixture);
        expect(fs.writeFile.mock.calls[0][1]).toMatchSnapshot();
      });

      it(`does not throw an error`, async () => {
        expect.assertions(2);
        await execute([fixture], __dirname);
        expect(console.error).not.toHaveBeenCalled();
        expect(process.exit).not.toHaveBeenCalled();
      });
    });
  });
});
