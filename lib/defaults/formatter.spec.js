let formatter;

describe('formatter', () => {
  beforeEach(() => {
    jest.resetModules();
    formatter = require('./formatter');
  });

  describe('with prettier', () => {
    it('formats the object with prettier settings', async () => {
      expect(await formatter({ foo: 'bar' })).toMatchInlineSnapshot(`
        "{
          \\"foo\\": \\"bar\\"
        }
        "
      `);
    });

    it('gracefully handles options not being found', async () => {
      const prettier = require('prettier');
      jest.spyOn(prettier, 'resolveConfig').mockImplementation(() => null);
      expect(await formatter({ foo: 'bar' })).toMatchInlineSnapshot(`
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

    it('formats the object using JSON.stringify', async () => {
      expect(await formatter({ foo: 'bar' })).toMatchInlineSnapshot(`
        "{
          \\"foo\\": \\"bar\\"
        }
        "
      `);
    });

    it('has a new line at the end', async () => {
      const content = await formatter({ foo: 'bar' });
      expect(content.endsWith('\n')).toBe(true);
    });

    afterAll(() => {
      jest.unmock('prettier');
    });
  });
});
