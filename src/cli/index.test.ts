import * as fs from 'fs-extra';

import logErrorAndExit from './error';
import * as config from './config';
import * as cli from '.';

jest.mock('globby', () => () => ['config.json']);
jest.mock('./error');

describe('cli', () => {
  let mockReadJSONSync;
  let mockWriteFileSync;
  let mockConsoleLog;
  let mockConsoleWarn;

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
    expect.assertions(2);

    await cli.execute(null as any);

    expect(logErrorAndExit).toHaveBeenCalled();
    expect(console.warn).toHaveBeenCalledTimes(1);
  });
});
