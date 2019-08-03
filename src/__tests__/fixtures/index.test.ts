import * as path from 'path';

import * as fs from 'fs-extra';
import * as glob from 'globby';

const fixtures = require('glob').sync('*.json', {
  absolute: false,
  cwd: __dirname,
});

const { execute } = require('../../cli');

describe('Fixtures', () => {
  const processExit = process.exit;
  let mockWriteFile;
  let mockConsoleLog;
  let mockConsoleError;
  let mockProcessExit;

  beforeAll(() => {
    mockConsoleLog = jest.spyOn(console, 'log').mockReturnValue(undefined);
    mockConsoleError = jest.spyOn(console, 'error').mockReturnValue(undefined);
    mockWriteFile = jest.spyOn(fs, 'writeFileSync').mockReturnValue(undefined);
    mockProcessExit = jest.fn();
    Object.defineProperty(process, 'exit', { value: mockProcessExit });
  });

  beforeEach(async () => {
    mockConsoleLog.mockClear();
    mockConsoleError.mockClear();
    mockWriteFile.mockClear();
    mockProcessExit.mockClear();
  });

  afterAll(() => {
    Object.defineProperty(process, 'exit', processExit);
    mockConsoleLog.mockRestore();
    mockConsoleError.mockRestore();
  });

  describe.each(fixtures)(`Formatting "%s"`, filename => {
    const filepath = path.join(__dirname, filename);
    it(`produces an expected output`, async () => {
      expect.assertions(3);

      await execute([filepath, '-w']);

      expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
      expect(mockWriteFile.mock.calls[0][0]).toEqual(filepath);
      expect(mockWriteFile.mock.calls[0][1]).toMatchSnapshot(filename);
    });

    it(`does not throw an error`, async () => {
      expect.assertions(2);
      await execute([filepath]);
      expect(console.error).not.toHaveBeenCalled();
      expect(process.exit).not.toHaveBeenCalled();
    });
  });
});
