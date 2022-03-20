import { timer } from './timer';

describe('timer util', () => {
  it('provides the elapsed time', () => {
    const elapsed = timer()()();
    expect(elapsed.milliseconds).toEqual(expect.any(Number));
  });
});
