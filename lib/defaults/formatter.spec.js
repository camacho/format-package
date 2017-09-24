const formatter = require('./formatter');

describe('formatter', () => {
  it('prints the object with spacing', () => {
    expect(formatter({ foo: 'bar' })).toMatchSnapshot();
  });
});
