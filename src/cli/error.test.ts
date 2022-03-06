import logError from './error';

describe('error', () => {
  let mockConsoleError;
  let error;

  beforeAll(() => {
    mockConsoleError = jest.spyOn(console, 'error').mockReturnValue(undefined);
  });

  beforeEach(() => {
    error = new Error('Standard message.');
  });

  afterEach(() => {
    mockConsoleError.mockClear();
  });

  afterAll(() => {
    mockConsoleError.mockRestore();
  });

  it('prints out strings as error messages', () => {
    logError('hello');
    expect(mockConsoleError.mock.calls[0][0]).toMatchInlineSnapshot(
      `" ERROR  hello"`
    );
  });

  it('logs generic message and exists with 1 when called without error', () => {
    logError();
    expect(mockConsoleError.mock.calls[0][0]).toMatchInlineSnapshot(
      `" ERROR  Something went wrong!"`
    );
  });

  it('prints stderr', () => {
    error.stderr = 'Stderr message.';
    logError(error);
    expect(mockConsoleError.mock.calls[0][0]).toMatchInlineSnapshot(
      `" ERROR  Stderr message."`
    );
  });

  it('prints stdout', () => {
    error.stdout = 'Stdout message.';
    logError(error);
    expect(mockConsoleError.mock.calls[0][0]).toMatchInlineSnapshot(
      `" ERROR  Stdout message."`
    );
  });

  it('prints message', () => {
    logError(error);
    expect(mockConsoleError.mock.calls[0][0]).toMatchInlineSnapshot(
      `" ERROR  Error: Standard message."`
    );
  });
});
