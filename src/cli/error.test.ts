import logErrorAndExit from './error';

describe('error', () => {
  const processExit = process.exit;
  let mockConsoleError;
  let mockProcessExit;
  let error;

  beforeEach(() => {
    mockProcessExit = jest.fn();

    Object.defineProperty(process, 'exit', {
      value: mockProcessExit,
    });

    mockConsoleError = jest.spyOn(console, 'error').mockImplementation(v => v);
  });

  beforeEach(() => {
    error = new Error('Standard message.');
  });

  afterEach(() => {
    mockConsoleError.mockClear();
    mockProcessExit.mockClear();
  });

  afterAll(() => {
    Object.defineProperty(process, 'exit', { value: processExit });
    mockConsoleError.mockRestore();
  });

  it('logs generic message and exists with 1 when called without error', () => {
    logErrorAndExit();
    expect(mockConsoleError.mock.calls[0][0]).toMatchInlineSnapshot(
      `" ERROR  Something went wrong!"`
    );
    expect(process.exit).toHaveBeenCalledWith(1);
  });

  it('prints stderr', () => {
    error.stderr = 'Stderr message.';
    logErrorAndExit(error);
    expect(mockConsoleError.mock.calls[0][0]).toMatchInlineSnapshot(
      `" ERROR  Stderr message."`
    );
  });

  it('prints stdout', () => {
    error.stdout = 'Stdout message.';
    logErrorAndExit(error);
    expect(mockConsoleError.mock.calls[0][0]).toMatchInlineSnapshot(
      `" ERROR  Stdout message."`
    );
  });

  it('prints message', () => {
    logErrorAndExit(error);
    expect(mockConsoleError.mock.calls[0][0]).toMatchInlineSnapshot(
      `" ERROR  Error: Standard message."`
    );
  });

  it('exits with the given status or 1', () => {
    logErrorAndExit();
    logErrorAndExit({ code: 2 });

    expect(process.exit).toHaveBeenCalledTimes(2);
    expect(process.exit).toHaveBeenCalledWith(1);
    expect(process.exit).toHaveBeenCalledWith(2);
  });
});
