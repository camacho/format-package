// Make TypeScript treat as commonjs
export {};

let formatter;

describe('formatter', () => {
  beforeEach(() => {
    jest.resetModules();
    formatter = require('./formatter').default;
  });

  describe('with prettier', () => {
    it('formats the object with prettier settings', () => {
      return expect(formatter({ foo: 'bar' })).resolves.toMatchInlineSnapshot(`
        "{
          \\"foo\\": \\"bar\\"
        }
        "
      `);
    });

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
      jest.doMock('prettier', null);
    });

    afterAll(() => {
      jest.unmock('prettier');
    });

    it('formats the object using JSON.stringify', () => {
      return expect(formatter({ foo: 'bar' })).resolves.toMatchInlineSnapshot(`
        "{
          \\"foo\\": \\"bar\\"
        }
        "
      `);
    });

    it('has a new line at the end', () => {
      return expect(formatter({ foo: 'bar' })).resolves.toMatch(/\n$/);
    });
  });
});
