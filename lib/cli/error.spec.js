const logErrorAndExit = require('./error');

describe('error', () => {
  const processExit = process.exit;
  let error;

  beforeEach(() => {
    jest.spyOn(console, 'error');
    console.error.mockImplementation(v => v);

    Object.defineProperty(process, 'exit', {
      value: jest.fn(),
    });

    error = new Error('Standard message');
  });

  afterEach(() => {
    Object.defineProperty(process, 'exit', { value: processExit });
    console.error.mockRestore();
  });

  it('logs generic message and exists with 1 when called without error', () => {
    logErrorAndExit();
    expect(console.error.mock.calls[0][0]).toMatchSnapshot();
    expect(process.exit).toHaveBeenCalledWith(1);
  });

  it('prints stderr', () => {
    error.stderr = 'Stderr message';
    logErrorAndExit(error);
    expect(console.error.mock.calls[0][0]).toMatchSnapshot();
  });

  it('prints stdout', () => {
    error.stdout = 'Stdout message';
    logErrorAndExit(error);
    expect(console.error.mock.calls[0][0]).toMatchSnapshot();
  });

  it('prints message', () => {
    logErrorAndExit(error);
    expect(console.error.mock.calls[0][0]).toMatchSnapshot();
  });

  it('exits with the given status or 1', () => {
    logErrorAndExit();
    logErrorAndExit({ code: 2 });

    expect(process.exit).toHaveBeenCalledTimes(2);
    expect(process.exit).toHaveBeenCalledWith(1);
    expect(process.exit).toHaveBeenCalledWith(2);
  });
});
