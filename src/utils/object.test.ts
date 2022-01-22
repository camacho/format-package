import 'jest-extended';
import { alphabetize } from './object';

describe('object', () => {
  describe('alphabetize', () => {
    it('does not alphabetize non-objects', () => {
      expect(alphabetize('foo')).toEqual('foo');
    });

    it('recursively loops over an object', () => {
      const obj = {
        foo: 'bar',
        baz: {
          qux: 'foo',
        },
      };

      expect(alphabetize(obj)).toMatchInlineSnapshot(`
        Object {
          "baz": Object {
            "qux": "foo",
          },
          "foo": "bar",
        }
      `);
    });

    it('loops over an array', () => {
      const obj = [
        {
          foo: 'bar',
          baz: {
            qux: 'foo',
          },
        },
      ];
      expect(alphabetize(obj)).toMatchInlineSnapshot(`
        Array [
          Object {
            "baz": Object {
              "qux": "foo",
            },
            "foo": "bar",
          },
        ]
      `);
    });
  });
});
