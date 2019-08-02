jest.mock('fs-extra');
jest.mock('console');
jest.mock('globby', () => () => ['config.json']);

jest.mock('./error');

import { readJson, writeFile } from 'fs-extra';

import logErrorAndExit from './error';
import * as config from './config';
import * as cli from './';

describe('cli', () => {
  let mockReadJSON;
  let mockConsoleLog;
  let mockConsoleWarn;

  beforeAll(() => {
    let mockConsoleLog = jest
      .spyOn(console, 'log')
      .mockImplementation(() => {});
    let mockConsoleWarn = jest
      .spyOn(console, 'warn')
      .mockImplementation(() => {});
  });

  beforeEach(() => {
    (readJson as jest.Mock).mockReturnValue({ name: 'foo' });
  });

  afterEach(() => {
    mockConsoleLog.mockReset();
    mockConsoleWarn.mockReset();
  });

  afterAll(() => {
    mockConsoleLog.mockRestore();
    mockConsoleWarn.mockRestore();
  });

  it('parses arguments', async () => {
    expect.assertions(1);

    const configSpy = jest.spyOn(config, 'search');
    await cli.execute('--verbose');

    expect(configSpy).toHaveBeenCalled();
  });

  it('writes the contents', async () => {
    expect.assertions(1);

    await cli.execute('--write');

    expect(writeFile).toHaveBeenCalled();
  });

  it('prints the contents if verbose is set', async () => {
    expect.assertions(1);

    await cli.execute('--verbose --write');

    expect(console.log).toHaveBeenCalledTimes(2);
  });

  it('catches errors', async () => {
    expect.assertions(2);

    await cli.execute(null);

    expect(logErrorAndExit).toHaveBeenCalled();
    expect(console.warn).toHaveBeenCalledTimes(1);
  });
});
