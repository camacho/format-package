let formatter;

describe('formatter', () => {
  beforeEach(async () => {
    vi.resetModules();
    formatter = (await import('./formatter.ts')).default;
  });

  describe('with prettier', () => {
    it('formats the object with prettier settings', () =>
      expect(formatter({ foo: 'bar' })).resolves.toMatchInlineSnapshot(`
        "{
          "foo": "bar"
        }
        "
      `));

    it('gracefully handles options not being found', async () => {
      vi.resetModules();
      vi.doMock('prettier', async () => {
        const actual =
          await vi.importActual<typeof import('prettier')>('prettier');
        return {
          ...actual,
          resolveConfig: vi.fn(() => null),
        };
      });
      formatter = (await import('./formatter.ts')).default;

      return expect(formatter({ foo: 'bar' })).resolves.toMatchInlineSnapshot(`
        "{
          "foo": "bar"
        }
        "
      `);
    });
  });

  describe('without prettier', () => {
    beforeAll(() => {
      // Hack to make prettier not be found when attempting
      // to dynamically import the dependency
      vi.doMock('prettier', () => {
        throw new Error('Cannot find module prettier');
      });
    });

    afterAll(() => {
      // doUnmock (not the hoisted unmock) so it actually runs here in afterAll,
      // pairing with the doMock above.
      vi.doUnmock('prettier');
    });

    it('formats the object using JSON.stringify', () =>
      expect(formatter({ foo: 'bar' })).resolves.toMatchInlineSnapshot(`
        "{
          "foo": "bar"
        }
        "
      `));

    it('has a new line at the end', () =>
      expect(formatter({ foo: 'bar' })).resolves.toMatch(/\n$/));
  });
});
