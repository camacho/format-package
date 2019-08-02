import transform from './transform';

describe('transform', () => {
  it('alphabetizes the object if no transformation is provided', () => {
    const key = 'foo';
    const value = { qux: 'baz', bar: 'foo' };

    return expect(transform(key, value)).resolves.toMatchInlineSnapshot(`
      Array [
        "foo",
        Object {
          "bar": "foo",
          "qux": "baz",
        },
      ]
    `);
  });

  it('uses the transformation by key', async () => {
    expect.assertions(2);

    const key = 'foo';
    const value = 'prev';
    const transformations = {
      foo: jest.fn(k => [k, 'transformed']),
    };

    await expect(transform(key, value, transformations)).resolves
      .toMatchInlineSnapshot(`
      Array [
        "foo",
        "transformed",
      ]
    `);

    expect(transformations.foo).toHaveBeenCalledWith(key, value);
  });

  it('returns the untransformed values otherwise', () => {
    const key = 'foo';
    const value = 'bar';

    return expect(transform(key, value)).resolves.toEqual([key, value]);
  });
});
