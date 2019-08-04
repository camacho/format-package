const parse = require('./parse');

describe('parse', () => {
  it('parses positional files', () => {
    const argv = parse('-v **/package.json');

    expect(argv.write).toBeFalsy();
    expect(argv.v).toBeTruthy();
    expect(argv.verbose).toBeTruthy();
    expect(argv.files[0]).toEqual('**/package.json');
  });
});
