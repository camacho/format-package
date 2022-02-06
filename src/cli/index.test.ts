const mockFormat = jest.fn();
import * as fs from 'fs-extra';

import logErrorAndExit from './error';
import * as config from './config';
import * as cli from '.';

jest.mock('globby', () => () => ['config.json']);
jest.mock('./error');
jest.mock('../lib', () => ({ default: mockFormat }));

describe('cli', () => {
  let mockReadJSONSync;
  let mockWriteFileSync;
  let mockConsoleLog;
  let mockConsoleWarn;

  beforeEach(() => {
    mockFormat.mockImplementation((v) => v);
  });

  beforeAll(() => {
    mockReadJSONSync = jest
      .spyOn(fs, 'readJSONSync')
      .mockReturnValue({ name: 'foo' });
    mockWriteFileSync = jest
      .spyOn(fs, 'writeFileSync')
      .mockReturnValue(undefined);
    mockConsoleLog = jest.spyOn(console, 'log').mockReturnValue(undefined);
    mockConsoleWarn = jest.spyOn(console, 'warn').mockReturnValue(undefined);
  });

  afterEach(() => {
    mockFormat.mockReset();
    mockConsoleLog.mockClear();
    mockConsoleWarn.mockClear();
  });

  afterAll(() => {
    mockReadJSONSync = jest
      .spyOn(fs, 'readJSONSync')
      .mockReturnValue({ name: 'foo' });
    mockWriteFileSync = jest
      .spyOn(fs, 'writeFileSync')
      .mockReturnValue(undefined);

    mockConsoleLog.mockRestore();
    mockConsoleWarn.mockRestore();
  });

  it('parses arguments', async () => {
    expect.assertions(1);

    const configSpy = jest.spyOn(config, 'search');
    await cli.execute(['--verbose']);

    expect(configSpy).toHaveBeenCalled();
  });

  it('writes the contents', async () => {
    expect.assertions(1);

    await cli.execute(['--write']);

    expect(fs.writeFileSync).toHaveBeenCalled();
  });

  it('prints the contents if verbose is set', async () => {
    expect.assertions(1);

    await cli.execute(['--verbose', '--write']);

    expect(console.log).toHaveBeenCalledTimes(2);
  });

  it('catches errors', async () => {
    expect.assertions(3);

    await expect(cli.execute(null as any)).resolves.toEqual(2);

    expect(logErrorAndExit).toHaveBeenCalled();
    expect(console.warn).toHaveBeenCalledTimes(1);
  });

  describe('`--check` flag', () => {
    it('should return `0` exit code if formatting did not changed the file', async () => {
      expect.assertions(1);

      await expect(cli.execute(['--check'])).resolves.toEqual(0);
    });
    it('should return `1` exit code if formatting changed the file', async () => {
      mockFormat.mockImplementation(() => ({ name: 'bar' }));
      expect.assertions(1);

      await expect(cli.execute(['--check', '--write'])).resolves.toEqual(1);
    });
    it('should return `1` exit code if formatting might change the file', async () => {
      mockFormat.mockImplementation(() => ({ name: 'bar' }));
      expect.assertions(1);

      await expect(cli.execute(['--check'])).resolves.toEqual(1);
    });
    it('should not print the contents by default', async () => {
      expect.assertions(2);

      await cli.execute(['--check']);

      expect(console.log).toHaveBeenCalledTimes(2);
      expect(console.log).not.toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({ name: 'foo' })
      );
    });
    it('should print the contents if verbose is set', async () => {
      expect.assertions(2);

      await cli.execute(['--verbose', '--check']);

      expect(console.log).toHaveBeenCalledTimes(2);
      expect(console.log).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({ name: 'foo' })
      );
    });
  });
});
