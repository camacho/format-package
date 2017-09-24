jest.mock('fs');
jest.mock('path', () => ({
  resolve: jest.fn((a, b) => [a, b].join('/')),
  relative: jest.fn((a, b) => b),
}));
jest.mock('./error');
jest.mock('./argv');
jest.mock('../utils/fs');
jest.mock('../');

const fs = require('fs');
const path = require('path');

const logErrorAndExit = require('./error');
const parseArgv = require('./argv');
const { find } = require('../utils/fs');
const format = require('../');

const cli = require('./');

describe('cli', () => {
  let argv = {};
  const processCWD = process.cwd;

  beforeEach(() => {
    Object.defineProperty(process, 'cwd', {
      value: jest.fn(() => 'cwd'),
    });

    jest.spyOn(console, 'log');
    console.log.mockImplementation(v => v);

    jest.spyOn(JSON, 'parse');

    argv = {};
    parseArgv.mockReset();
    parseArgv.mockReturnValue(argv);

    fs.readFileSync.mockClear();
    fs.writeFileSync.mockClear();
    path.resolve.mockClear();
    find.mockClear();
    format.mockClear();

    find.mockReturnValue('package.json');
    fs.readFileSync.mockReturnValue('{}');
    format.mockReturnValue('next');
  });

  afterEach(() => {
    console.log.mockRestore();
    JSON.parse.mockRestore();
    Object.defineProperty(process, 'cwd', { value: processCWD });
  });

  it('parses arguments', () => {
    cli();
    expect(parseArgv).toHaveBeenCalled();
  });

  it('searches for a package.json file if no file is given', () => {
    cli();
    expect(find).toHaveBeenCalledWith('package.json', 'cwd');
  });

  it('resolves the path relative to process.cwd', () => {
    argv.file = 'filename';
    cli();
    expect(path.resolve).toHaveBeenCalledWith('cwd', 'filename');
  });

  it('loads the config relative to process.cwd', () => {
    argv.config = 'config.json';
    cli();
    expect(path.resolve).toHaveBeenCalledWith('cwd', 'config.json');
  });

  it('reads the contents of the previous package and calls format', () => {
    argv.config = 'config.json';
    jest.mock(
      'cwd/config.json',
      () => ({
        configOptions: true,
      }),
      { virtual: true }
    );

    cli();
    expect(fs.readFileSync).toHaveBeenCalledWith('package.json', {
      encoding: 'utf8',
    });
    expect(JSON.parse).toHaveBeenCalledWith('{}');
    expect(format).toHaveBeenCalledWith(
      {},
      {
        configOptions: true,
      }
    );
  });

  it('writes the contents', () => {
    argv.write = true;

    cli();
    expect(fs.writeFileSync).toHaveBeenCalledWith('package.json', 'next', {
      encoding: 'utf8',
    });
    expect(console.log).toHaveBeenCalledTimes(1);
  });

  it('prints the contents if verbose is set', () => {
    argv.verbose = true;
    argv.write = true;

    cli();
    expect(console.log).toHaveBeenCalledTimes(2);
  });

  it('prints the contents if write is not set', () => {
    argv.write = false;

    cli();
    expect(console.log).toHaveBeenCalledTimes(1);
    expect(fs.writeFileSync).not.toHaveBeenCalled();
  });

  it('catches errors', () => {
    const error = new Error('Foo');
    find.mockImplementation(() => {
      throw error;
    });
    cli();
    expect(logErrorAndExit).toHaveBeenCalledWith(error);
  });
});
