const { callbackToPromise } = require('./promise');

describe('promise utils', () => {
  let fn;

  beforeEach(() => {
    fn = jest.fn();
  });

  it('wraps a callback method with a promise', () => {
    expect(callbackToPromise(fn)()).toBeInstanceOf(Promise);
  });

  it('passes success as promise resolve', async () => {
    expect.assertions(1);
    fn.mockImplementation((result, cb) => cb(undefined, result));
    const promisedFn = callbackToPromise(fn);
    const outcome = await promisedFn('success');
    expect(outcome).toEqual('success');
  });

  it('passes error as promise reject', async () => {
    expect.assertions(1);
    fn.mockImplementation((err, cb) => cb(err));
    const promisedFn = callbackToPromise(fn);

    try {
      await promisedFn('error');
    } catch (error) {
      expect(error).toMatch('error');
    }
  });
});
