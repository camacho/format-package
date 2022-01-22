import sortScripts from 'sort-scripts';
import transformations from './transformations';

jest.mock('sort-scripts');
const mockSortScripts = sortScripts as jest.Mock;

describe('default transformations', () => {
  describe('scripts', () => {
    beforeEach(() => {
      mockSortScripts.mockReset();
      mockSortScripts.mockReturnValue(
        new Array(5).fill(0).map((_, i) => [`name${i}`, `value${i}`])
      );
    });

    it('sorts the scripts based on 3rd party module', () => {
      expect(transformations.scripts('key', 'value')).toMatchInlineSnapshot(`
        Array [
          "key",
          Object {
            "name0": "value0",
            "name1": "value1",
            "name2": "value2",
            "name3": "value3",
            "name4": "value4",
          },
        ]
      `);
      expect(mockSortScripts).toHaveBeenCalledWith('value');
    });

    it('does not sort exports', () => {
      expect(
        transformations.exports('exports', {
          foo: 'bar',
          baz: 'qux',
        })
      ).toMatchInlineSnapshot(`
        Array [
          "exports",
          Object {
            "baz": "qux",
            "foo": "bar",
          },
        ]
      `);
    });
  });
});
