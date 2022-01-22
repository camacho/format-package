import { pluralize } from './strings';

describe('string utils', () => {
  describe('pluralize', () => {
    it('takes a subject, count, and plural format', () => {
      expect(pluralize('foo', 0, 'bar')).toMatch('bar');
      expect(pluralize('foo', 1, 'bar')).toMatch('foo');
      expect(pluralize('foo', 2, 'bar')).toMatch('bar');
    });

    it('assumes a plural format if none is given', () => {
      expect(pluralize('foo', 2)).toMatch('foos');
    });
  });
});
