jest.mock('path', () => ({
  resolve: jest.fn((...args) => args.join('/')),
  relative: jest.fn((a, b) => b),
}));
jest.mock('config.json', () => ({ configOptions: true }), {
  virtual: true,
});
jest.mock('globby', () => () => ['config.json']);
jest.mock('./error');
jest.mock('./parse', () => jest.fn());
jest.mock('../fs');
jest.mock('../');

const path = require('path');

const logErrorAndExit = require('./error');
const parse = require('./parse');
const fs = require('../fs');
const format = require('../');

// eslint-disable-next-line
const config = require('config.json');

const cli = require('./');

describe('cli', () => {
  let argv = {};

  beforeAll(() => {
    jest.spyOn(console, 'log');
    console.log.mockImplementation(v => v);
    jest.spyOn(JSON, 'parse');
  });

  beforeEach(() => {
    argv = { files: ['config.json'] };

    console.log.mockReset();

    parse.mockReset();
    parse.mockReturnValue(argv);

    fs.read.mockClear();
    fs.write.mockClear();

    path.resolve.mockClear();
    format.mockClear();

    fs.read.mockReturnValue('{}');
    format.mockReturnValue('next');
  });

  afterAll(() => {
    console.log.mockRestore();
    JSON.parse.mockRestore();
  });

  it('parses arguments', async () => {
    expect.assertions(1);
    await cli('argv');
    expect(parse).toHaveBeenCalledWith('argv');
  });

  it('resolves the path relative to process.cwd', async () => {
    expect.assertions(1);
    await cli('argv');
    expect(path.resolve).toHaveBeenCalledWith('config.json');
  });

  it('loads the config', async () => {
    expect.assertions(1);
    argv.config = 'config.json';
    await cli('argv');
    expect(format).toHaveBeenCalledWith({}, config);
  });

  it('reads the contents of the previous package and calls format', async () => {
    expect.assertions(3);

    argv.config = 'config.json';

    await cli('argv');

    expect(fs.read).toHaveBeenCalledWith(argv.files[0], 'utf8');
    expect(JSON.parse).toHaveBeenCalledWith('{}');
    expect(format).toHaveBeenCalledWith({}, { configOptions: true });
  });

  it('writes the contents', async () => {
    expect.assertions(2);

    argv.write = true;

    await cli('argv');

    expect(fs.write).toHaveBeenCalledWith(argv.files[0], 'next', {
      encoding: 'utf8',
    });

    expect(console.log).toHaveBeenCalledTimes(2);
  });

  it('prints the contents if verbose is set', async () => {
    expect.assertions(1);

    argv.verbose = true;
    argv.write = true;

    await cli('argv');

    expect(console.log).toHaveBeenCalledTimes(2);
  });

  it('prints the contents if write is not set', async () => {
    expect.assertions(2);

    argv.write = false;

    await cli('argv');

    expect(console.log).toHaveBeenCalledTimes(2);
    expect(fs.write).not.toHaveBeenCalled();
  });

  it('catches errors', async () => {
    expect.assertions(1);

    const error = new Error('Foo');
    fs.read.mockImplementation(() => {
      throw error;
    });

    await cli('argv');

    expect(logErrorAndExit).toHaveBeenCalledWith(error);
  });
});
