jest.mock('sort-scripts');

const sortScripts = require('sort-scripts');
const transformations = require('./transformations');

describe('default transformations', () => {
  describe('scripts', () => {
    beforeEach(() => {
      sortScripts.mockReset();
      sortScripts.mockReturnValue(
        new Array(5).fill(0).map((_, i) => [`name${i}`, `value${i}`])
      );
    });

    it('sorts the scripts based on 3rd party module', () => {
      expect(transformations.scripts('key', 'value')).toMatchSnapshot();
      expect(sortScripts).toHaveBeenCalledWith('value');
    });
  });
});
