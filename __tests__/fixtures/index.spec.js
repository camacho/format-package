const fs = require('fs');
const path = require('path');

const fixtures = require('glob').sync('**/**.json', {
  absolute: true,
  cwd: __dirname,
});

const execute = require('../../lib/cli');

describe('Fixtures', () => {
  const processExit = process.exit;

  beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(v => v);
    jest.spyOn(console, 'error').mockImplementation(v => v);

    jest
      .spyOn(fs, 'writeFile')
      .mockImplementation((file, contents, options, cb) => cb());

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
    fs.writeFile.mockRestore();
  });

  fixtures.forEach(fixture => {
    const filename = path.relative(__dirname, fixture);

    describe(`Formatting ${filename}`, () => {
      it(`produces an expected output`, async () => {
        expect.assertions(3);

        await execute([fixture, '-w']);

        expect(fs.writeFile).toHaveBeenCalledTimes(1);
        expect(fs.writeFile.mock.calls[0][0]).toEqual(fixture);
        expect(fs.writeFile.mock.calls[0][1]).toMatchSnapshot();
      });

      it(`does not throw an error`, async () => {
        expect.assertions(2);
        await execute([fixture]);
        expect(console.error).not.toHaveBeenCalled();
        expect(process.exit).not.toHaveBeenCalled();
      });
    });
  });
});
