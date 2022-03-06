const mockFormat = jest.fn((value) => value);
const mockGlobby = jest.fn(() => ['config.json']);
const mockLogErrorAndExit = jest.fn();

import fs from 'fs-extra';

import * as config from './config';
import * as cli from '.';

jest.mock('globby', () => mockGlobby);
jest.mock('./error', () => mockLogErrorAndExit);
jest.mock('../lib', () => mockFormat);

describe('cli', () => {
  let mockReadJSONSync;
  let mockWriteFileSync;
  let mockConsoleLog;
  let mockConsoleWarn;

  beforeEach(() => {
    mockFormat.mockImplementation((v) => v);
  });

  beforeAll(() => {
    mockReadJSONSync = jest.spyOn(fs, 'readJSONSync');
    mockWriteFileSync = jest.spyOn(fs, 'writeFileSync');
    mockConsoleLog = jest.spyOn(console, 'log').mockReturnValue(undefined);
    mockConsoleWarn = jest.spyOn(console, 'warn').mockReturnValue(undefined);
  });

  beforeEach(() => {
    mockReadJSONSync.mockImplementation(() => ({
      name: `foo${mockFormat.mock.calls.length}`,
    }));
    mockWriteFileSync.mockReturnValue(undefined);
    mockFormat.mockImplementation((value) => value);
  });

  afterEach(() => {
    mockFormat.mockClear();
    mockGlobby.mockClear();
    mockLogErrorAndExit.mockClear();
    mockReadJSONSync.mockClear();
    mockWriteFileSync.mockClear();
    mockConsoleLog.mockClear();
    mockConsoleWarn.mockClear();
  });

  afterAll(() => {
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

    expect(mockConsoleLog).toHaveBeenCalledTimes(2);
  });

  it('catches errors', async () => {
    expect.assertions(3);

    await expect(cli.execute(null as any)).resolves.toEqual(1);
    expect(mockLogErrorAndExit).toHaveBeenCalled();
    expect(mockConsoleWarn).toHaveBeenCalledTimes(1);
  });

  describe('`--check` flag', () => {
    it('should return `0` exit code if formatting would not change the file', async () => {
      expect.assertions(1);
      await expect(cli.execute(['--check'])).resolves.toEqual(0);
    });

    it('should return `2` exit code if formatting changed the file', async () => {
      expect.assertions(1);
      mockFormat.mockReturnValueOnce('not the argument value');
      await expect(cli.execute(['--check', '--write'])).resolves.toEqual(2);
    });

    it('should return `2` exit code if formatting would change the file', async () => {
      expect.assertions(1);
      mockFormat.mockReturnValueOnce('not the argument value');
      await expect(cli.execute(['--check'])).resolves.toEqual(2);
    });

    it('should pluralize the messaging if formatting might change multiple files', async () => {
      expect.assertions(1);
      mockGlobby.mockReturnValueOnce(['package1.json', 'package2.json']);
      mockFormat.mockImplementation(() => `foo${mockFormat.mock.calls.length}`);
      await cli.execute(['--check']);
      expect(mockConsoleLog).toHaveBeenCalledWith('2 files different.');
    });

    it('should not print the contents by default', async () => {
      expect.assertions(1);
      await cli.execute(['--check']);
      expect(mockConsoleLog).toHaveBeenCalledTimes(1);
    });

    it('should print the contents if verbose is set', async () => {
      expect.assertions(3);
      await cli.execute(['--verbose', '--check']);
      expect(mockConsoleLog).toHaveBeenCalledTimes(2);
      expect(mockConsoleLog).toHaveBeenCalledWith({
        name: 'foo0',
      });
      expect(mockConsoleLog).toHaveBeenLastCalledWith('0 files changed');
    });

    it('should handle errors', async () => {
      expect.assertions(1);

      mockFormat.mockImplementationOnce(() => {
        throw new Error('foo');
      });

      await expect(cli.execute(['--check'])).resolves.toEqual(1);
    });
  });
});
