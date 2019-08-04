const { callbackToPromise } = require('./promise');

describe('promise utils', () => {
  let fn;

  beforeEach(() => {
    fn = jest.fn();
  });

  it('wraps a callback method with a promise', () => {
    expect(callbackToPromise(fn)()).toBeInstanceOf(Promise);
  });

  it('passes success as promise resolve', () => {
    fn.mockImplementation((result, cb) => cb(undefined, result));
    const promisedFn = callbackToPromise(fn);

    return expect(promisedFn('success')).resolves.toEqual('success');
  });

  it('passes error as promise reject', () => {
    fn.mockImplementation((err, cb) => cb(err));
    const promisedFn = callbackToPromise(fn);

    return expect(promisedFn('error')).rejects.toMatch('error');
  });
});
