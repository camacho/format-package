const { alphabetize, has } = require('./object');

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
    beforeEach(() => {
      const oldHas = Object.prototype.hasOwnProperty;
      jest.spyOn(Object.prototype, 'hasOwnProperty');
      Object.prototype.hasOwnProperty.mockImplementation(oldHas);
    });

    afterEach(() => {
      Object.prototype.hasOwnProperty.mockRestore();
    });

    it('uses Object.prototype.hasOwnProperty', () => {
      expect(has({ foo: 'bar' }, 'foo')).toEqual(true);
      expect(Object.prototype.hasOwnProperty).toHaveBeenCalledWith('foo');
    });
  });
});
