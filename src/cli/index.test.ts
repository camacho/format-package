jest.mock('fs-extra');
jest.mock('console');
jest.mock('globby', () => () => ['config.json']);

jest.mock('./error');

const fs = require('fs-extra');

const logErrorAndExit = require('./error');
const config = require('./config');
const cli = require('./');

describe('cli', () => {
  beforeAll(() => {
    jest.spyOn(console, 'log');
    jest.spyOn(console, 'warn');
    console.log.mockImplementation(v => v);
    console.warn.mockImplementation(v => v);
  });

  beforeEach(() => {
    fs.readJson.mockReturnValue({ name: 'foo' });
    console.log.mockReset();
    console.warn.mockReset();
  });

  afterAll(() => {
    console.log.mockRestore();
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

    expect(fs.writeFile).toHaveBeenCalled();
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
