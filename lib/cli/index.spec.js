jest.mock('path', () => ({
  resolve: jest.fn((a, b) => [a, b].join('/')),
  relative: jest.fn((a, b) => b),
}));
jest.mock('./error');
jest.mock('./parse', () => jest.fn());
jest.mock('../fs');
jest.mock('../');

const path = require('path');

const logErrorAndExit = require('./error');
const parse = require('./parse');
const fs = require('../fs');
const format = require('../');

const cli = require('./');

describe('cli', () => {
  let argv = {};

  beforeEach(() => {
    jest.spyOn(console, 'log');
    console.log.mockImplementation(v => v);

    jest.spyOn(JSON, 'parse');

    argv = {};
    parse.mockReset();
    parse.mockReturnValue(argv);

    fs.read.mockClear();
    fs.write.mockClear();
    fs.find.mockClear();

    path.resolve.mockClear();
    format.mockClear();

    fs.find.mockReturnValue('package.json');
    fs.read.mockReturnValue('{}');
    format.mockReturnValue('next');
  });

  afterEach(() => {
    console.log.mockRestore();
    JSON.parse.mockRestore();
  });

  it('parses arguments', async () => {
    expect.assertions(2);

    await cli('argv', 'cwd');

    expect(parse).toHaveBeenCalledWith('argv');
    expect(fs.find).toHaveBeenCalledWith(expect.any(String), 'cwd');
  });

  it('searches for a package.json file if no file is given', async () => {
    expect.assertions(1);

    await cli('argv', 'cwd');

    expect(fs.find).toHaveBeenCalledWith('package.json', 'cwd');
  });

  it('resolves the path relative to process.cwd', async () => {
    expect.assertions(1);

    argv.file = 'filename';

    await cli('argv', 'cwd');

    expect(path.resolve).toHaveBeenCalledWith('cwd', 'filename');
  });

  it('loads the config relative to process.cwd', async () => {
    expect.assertions(1);

    argv.config = 'config.json';

    await cli('argv', 'cwd');

    expect(path.resolve).toHaveBeenCalledWith('cwd', 'config.json');
  });

  it('reads the contents of the previous package and calls format', async () => {
    expect.assertions(3);

    argv.config = 'config.json';
    jest.mock('cwd/config.json', () => ({ configOptions: true }), {
      virtual: true,
    });

    await cli('argv', 'cwd');

    expect(fs.read).toHaveBeenCalledWith('package.json', 'utf8');
    expect(JSON.parse).toHaveBeenCalledWith('{}');
    expect(format).toHaveBeenCalledWith({}, { configOptions: true });
  });

  it('writes the contents', async () => {
    expect.assertions(2);

    argv.write = true;

    await cli('argv', 'cwd');

    expect(fs.write).toHaveBeenCalledWith('package.json', 'next', {
      encoding: 'utf8',
    });
    expect(console.log).toHaveBeenCalledTimes(1);
  });

  it('prints the contents if verbose is set', async () => {
    expect.assertions(1);

    argv.verbose = true;
    argv.write = true;

    await cli('argv', 'cwd');

    expect(console.log).toHaveBeenCalledTimes(2);
  });

  it('prints the contents if write is not set', async () => {
    expect.assertions(2);

    argv.write = false;

    await cli('argv', 'cwd');

    expect(console.log).toHaveBeenCalledTimes(1);
    expect(fs.write).not.toHaveBeenCalled();
  });

  it('catches errors', async () => {
    expect.assertions(1);

    const error = new Error('Foo');
    fs.find.mockImplementation(() => {
      throw error;
    });

    await cli('argv', 'cwd');

    expect(logErrorAndExit).toHaveBeenCalledWith(error);
  });
});
