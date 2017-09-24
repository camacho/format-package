const sort = require('./sort');

describe('sort', () => {
  let order;
  let keys;
  let restKey;

  beforeEach(() => {
    restKey = '...rest';
    keys = ['foo', 'bar', 'baz', 'qux'];
    order = ['foo', '...rest', 'baz'];
  });

  it('orders relevant keys', () => {
    expect(sort(keys, order)).toMatchSnapshot();
  });

  it('allows any key to be used to denote the "rest"', () => {
    restKey = '...extra';
    order = ['baz', 'foo', '...extra'];
    expect(sort(keys, order, restKey)).toMatchSnapshot();
  });

  it('appends extra keys to the end in alphabetical order if no "rest" is found', () => {
    order = ['qux'];
    expect(sort(keys, order)).toMatchSnapshot();
  });
});
