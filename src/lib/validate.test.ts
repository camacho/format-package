import validate from './validate';

describe('validate', () => {
  let prevPkg;
  let nextPkg;

  beforeEach(() => {
    prevPkg = { foo: 'bar' };
    nextPkg = { foo: 'bar' };
  });

  it('validates that all keys from previous package.json are present in next package.json', () => {
    expect(() => validate(prevPkg, nextPkg)).not.toThrow();
  });

  it('throws if the packages are different', () => {
    const badPkg = { foo: 'bar', baz: 'qux' };

    expect(() => validate(prevPkg, badPkg)).toThrow();
    expect(() => validate(badPkg, nextPkg)).toThrow();
  });
});
