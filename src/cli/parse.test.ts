import parse from './parse';

describe('parse', () => {
  it('parses positional files', () => {
    expect(parse(['-v', '**/package.json'])).toMatchObject({
      write: false,
      ignore: ['**/node_modules/**'],
      verbose: true,
      files: ['**/package.json'],
    });
  });
});
