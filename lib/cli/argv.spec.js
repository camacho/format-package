jest.mock('yargs', () => {
  const mock = {
    command: jest.fn(() => mock),
    options: jest.fn(() => mock),
    help: jest.fn(() => mock),
    argv: 'argv',
  };
  return mock;
});

const yargs = require('yargs');

const parseArgv = require('./argv');

describe('argv', () => {
  it('parses args with yargs', () => {
    expect(parseArgv()).toEqual('argv');
    expect(yargs.command.mock.calls[0]).toMatchSnapshot();
    expect(yargs.options.mock.calls[0][0]).toMatchSnapshot();
    expect(yargs.help).toHaveBeenCalledWith('h');
  });
});
