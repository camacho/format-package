import 'jest-extended';
import { alphabetize } from './object';

describe('object', () => {
  describe('alphabetize', () => {
    it('does not alphabetize non-objects', () => {
      expect(() => alphabetize(() => {})).toThrowErrorMatchingInlineSnapshot(
        `"Value is not able to be alphabetized"`
      );
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

    describe('handling arrays', () => {
      it('alphabetizes each value in the array', () => {
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

        expect(alphabetize(['foo', 'bar', 'baz'])).toMatchInlineSnapshot(`
          Array [
            "foo",
            "bar",
            "baz",
          ]
        `);
      });
    });

    it('skips unalphabetizable values', () => {
      const obj = [
        {
          foo: undefined,
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
                  "foo": undefined,
                },
              ]
          `);

      expect(alphabetize(undefined as any)).toEqual(undefined);
    });

    it('handles mix of types while preserving order', () => {
      const obj = [
        'foo',
        {
          foo: undefined,
          baz: {
            qux: 'foo',
          },
        },
        [
          'hello',
          1,
          {
            qux: 'foo',
            unknown: null,
          },
          'world',
          false,
          new Set([1, 2]),
        ],
        'bar',
        true,
        1,
        undefined,
        new Set([3, 4]),
        null,
        5,
        false,
      ];

      expect(alphabetize(obj)).toMatchInlineSnapshot(`
        Array [
          "foo",
          Object {
            "baz": Object {
              "qux": "foo",
            },
            "foo": undefined,
          },
          Array [
            "hello",
            1,
            Object {
              "qux": "foo",
              "unknown": null,
            },
            "world",
            false,
            Object {},
          ],
          "bar",
          true,
          1,
          undefined,
          Object {},
          null,
          5,
          false,
        ]
      `);
    });
  });
});
