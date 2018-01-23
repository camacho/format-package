const mock = {
  command: jest.fn(() => mock),
  options: jest.fn(() => mock),
  help: jest.fn(() => mock),
  parse: jest.fn(v => v),
};

jest.mock('yargs', () => jest.fn(() => mock));

const parse = require('./parse');

describe('parse', () => {
  it('parses args with yargs', () => {
    expect(parse('argv')).toEqual('argv');
    expect(mock.command.mock.calls[0]).toMatchSnapshot();
    expect(mock.options.mock.calls[0][0]).toMatchSnapshot();
    expect(mock.help).toHaveBeenCalledWith('h');
  });
});
