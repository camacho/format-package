import Timer from './timer';

describe('timer util', () => {
  let timer;

  beforeEach(() => {
    timer = new Timer();
  });

  it('provides the elapsed time', () => {
    const start = timer.start();
    const elapsed = timer.end();

    expect(start).toEqual(
      expect.arrayContaining([expect.any(Number), expect.any(Number)])
    );

    expect(elapsed.milliseconds).toEqual(expect.any(Number));
  });
});
