jest.mock('yargs', () => {
  const mock = {
    command: jest.fn(() => mock),
    options: jest.fn(() => mock),
    help: jest.fn(() => mock),
    parse: jest.fn(v => v),
  };
  return mock;
});

const yargs = require('yargs');
const parse = require('./parse');

describe('parse', () => {
  it('parses args with yargs', () => {
    expect(parse('argv')).toEqual('argv');
    expect(yargs.command.mock.calls[0]).toMatchSnapshot();
    expect(yargs.options.mock.calls[0][0]).toMatchSnapshot();
    expect(yargs.help).toHaveBeenCalledWith('h');
  });
});
