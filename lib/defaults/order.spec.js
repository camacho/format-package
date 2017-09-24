const order = require('./order');

describe('default order', () => {
  it('can be loaded', () => {
    expect(order).toMatchSnapshot();
  });

  it('has a `...rest` key', () => {
    expect(order.indexOf('...rest')).not.toEqual(-1);
  });
});
