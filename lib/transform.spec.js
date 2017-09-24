const transform = require('./transform');

describe('transform', () => {
  it('alphabetizes the object if no transformation is provided', async () => {
    expect.assertions(1);

    const key = 'foo';
    const value = { qux: 'baz', bar: 'foo' };

    expect(await transform(key, value)).toMatchSnapshot();
  });

  it('uses the transformation by key', async () => {
    expect.assertions(2);

    const key = 'foo';
    const value = 'prev';
    const transformations = {
      foo: jest.fn(k => [k, 'transformed']),
    };
    expect(await transform(key, value, transformations)).toMatchSnapshot();
    expect(transformations.foo).toHaveBeenCalledWith(key, value);
  });

  it('returns the untransformed values otherwise', async () => {
    expect.assertions(1);

    const key = 'foo';
    const value = 'bar';
    expect(await transform(key, value)).toEqual([key, value]);
  });
});
