// Make TypeScript treat as commonjs
let formatter;

describe('formatter', () => {
  beforeEach(() => {
    jest.resetModules();
    formatter = require('./formatter').default;
  });

  describe('with prettier', () => {
    it('formats the object with prettier settings', () =>
      expect(formatter({ foo: 'bar' })).resolves.toMatchInlineSnapshot(`
        "{
          \\"foo\\": \\"bar\\"
        }
        "
      `));

    it('gracefully handles options not being found', () => {
      const prettier = require('prettier');
      jest.spyOn(prettier, 'resolveConfig').mockImplementation(() => null);

      return expect(formatter({ foo: 'bar' })).resolves.toMatchInlineSnapshot(`
        "{
          \\"foo\\": \\"bar\\"
        }
        "
      `);
    });
  });

  describe('without prettier', () => {
    beforeAll(() => {
      // Hack to make prettier not be found when attempting
      // to dynamically import the dependency
      jest.doMock('prettier', false as any);
    });

    afterAll(() => {
      jest.unmock('prettier');
    });

    it('formats the object using JSON.stringify', () =>
      expect(formatter({ foo: 'bar' })).resolves.toMatchInlineSnapshot(`
        "{
          \\"foo\\": \\"bar\\"
        }
        "
      `));

    it('has a new line at the end', () =>
      expect(formatter({ foo: 'bar' })).resolves.toMatch(/\n$/));
  });
});
