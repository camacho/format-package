import { Transformation } from '../types';

import transform from './transform';

describe('transform', () => {
  it('uses a catch all transform if none is specified for the key', () => {
    const key = 'foo';
    const value = { qux: 'baz', bar: 'foo' };

    return expect(
      transform(key, value, {
        '*': (k, v) => [k, v],
      })
    ).resolves.toEqual([key, value]);
  });

  it('uses the transformation by key', async () => {
    expect.assertions(2);

    const key = 'foo';
    const value = 'prev';
    const transformations = {
      foo: jest.fn((k: string, _) => [
        k,
        'transformed',
      ]) as jest.MockedFunction<Transformation>,
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

  describe('default transform', () => {
    it('uses the given default transform function', () => {
      const key = 'foo';
      const value = ['baz', 'bar'];

      return expect(
        transform(key, value, { '*': (k, v) => [k, v] })
      ).resolves.toEqual([key, ['baz', 'bar']]);
    });
  });
});
