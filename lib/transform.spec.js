const transform = require('./transform');

describe('transform', () => {
  it('alphabetizes the object if no transformation is provided', () => {
    const key = 'foo';
    const value = { qux: 'baz', bar: 'foo' };
    expect(transform(key, value)).toMatchSnapshot();
  });

  it('uses the transformation by key', () => {
    const key = 'foo';
    const value = 'prev';
    const transformations = {
      foo: jest.fn(k => [k, 'transformed']),
    };
    expect(transform(key, value, transformations)).toMatchSnapshot();
    expect(transformations.foo).toHaveBeenCalledWith(key, value);
  });

  it('returns the untransformed values otherwise', () => {
    const key = 'foo';
    const value = 'bar';
    expect(transform(key, value)).toEqual([key, value]);
  });
});
