const formatter = require('./formatter');

describe('formatter', () => {
  it('prints the object with spacing', () => {
    expect(formatter({ foo: 'bar' })).toMatchSnapshot();
  });

  it('has a new line at the end', () => {
    expect(formatter({ foo: 'bar' }).endsWith('\n')).toEqual(true);
  });
});
