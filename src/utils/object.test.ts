import 'jest-extended';
import { alphabetize, has } from './object';

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

  describe('has', () => {
    it('identifies properties on object, not on prototype', () => {
      expect(has({ foo: 'bar' }, 'foo')).toBeTrue();

      class Foo {
        constructor(public bar: string) {}
        foo() {}
      }

      const a = new Foo('test');
      expect(has(a, 'foo')).toBeFalse();
    });
  });
});
