const {
  mockFormat,
  mockGlobSync,
  mockReadFileSync,
  mockWriteFileSync,
  mockLogErrorAndExit,
  dirents,
} = vi.hoisted(() => {
  // node:fs globSync (withFileTypes) yields Dirents; the source filters to
  // files and joins parentPath/name, so the mock returns that same shape.
  const dirents = (...names: string[]) =>
    names.map((name) => ({ isFile: () => true, parentPath: '/cwd', name }));
  return {
    mockFormat: vi.fn((value) => value),
    mockGlobSync: vi.fn(() => dirents('config.json')),
    mockReadFileSync: vi.fn(),
    mockWriteFileSync: vi.fn(),
    mockLogErrorAndExit: vi.fn(),
    dirents,
  };
});

import * as config from './config/index.ts';
import * as cli from './index.ts';

vi.mock('node:fs', async (importOriginal) => {
  const actual = await importOriginal<typeof import('node:fs')>();
  return {
    ...actual,
    globSync: mockGlobSync,
    readFileSync: mockReadFileSync,
    writeFileSync: mockWriteFileSync,
  };
});
vi.mock('./error', () => ({ default: mockLogErrorAndExit }));
vi.mock('../lib', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../lib/index.ts')>();
  return { ...actual, default: mockFormat };
});

describe('cli', () => {
  let mockConsoleLog;
  let mockConsoleWarn;

  beforeEach(() => {
    mockFormat.mockImplementation((v) => v);
  });

  beforeAll(() => {
    mockConsoleLog = vi.spyOn(console, 'log').mockReturnValue(undefined);
    mockConsoleWarn = vi.spyOn(console, 'warn').mockReturnValue(undefined);
  });

  beforeEach(() => {
    mockReadFileSync.mockImplementation(() =>
      JSON.stringify({
        name: `foo-${mockFormat.mock.calls.length}`,
      })
    );
    mockWriteFileSync.mockReturnValue(undefined);
    mockFormat.mockImplementation((value) => JSON.stringify(value));
  });

  afterEach(() => {
    mockFormat.mockClear();
    mockGlobSync.mockClear();
    mockLogErrorAndExit.mockClear();
    mockReadFileSync.mockClear();
    mockWriteFileSync.mockClear();
    mockConsoleLog.mockClear();
    mockConsoleWarn.mockClear();
  });

  afterAll(() => {
    mockConsoleLog.mockRestore();
    mockConsoleWarn.mockRestore();
  });

  it('parses arguments', async () => {
    expect.assertions(1);

    const configSpy = vi.spyOn(config, 'search');
    await cli.execute(['--verbose']);

    expect(configSpy).toHaveBeenCalled();
  });

  it('writes the contents if the file changed', async () => {
    expect.assertions(1);

    mockFormat.mockImplementationOnce(() => 'value2');
    await cli.execute(['--write']);

    expect(mockWriteFileSync).toHaveBeenCalled();
  });

  it('does not write the contents if the contents do not change', async () => {
    expect.assertions(1);

    await cli.execute(['--write']);

    expect(mockWriteFileSync).not.toHaveBeenCalled();
  });

  it('prints the contents if verbose is set', async () => {
    expect.assertions(1);

    await cli.execute(['--verbose', '--write']);

    expect(mockConsoleLog).toHaveBeenCalledTimes(2);
  });

  it('catches errors', async () => {
    expect.assertions(3);

    await expect(cli.execute(null as any)).resolves.toEqual(1);
    expect(mockLogErrorAndExit).toHaveBeenCalled();
    expect(mockConsoleWarn).toHaveBeenCalledTimes(1);
  });

  it('reports the config filepath when a non-default config is used', async () => {
    expect.assertions(1);

    vi.spyOn(config, 'search').mockResolvedValueOnce({
      config: {},
      filepath: '/path/to/format-package.json',
      isDefault: false,
    });

    await cli.execute([]);

    expect(mockConsoleLog).toHaveBeenCalledWith(
      'Formatted 1 file with /path/to/format-package.json.'
    );
  });

  describe('`--check` flag', () => {
    it('should return `0` exit code if formatting would not change the file', async () => {
      expect.assertions(1);
      await expect(cli.execute(['--check'])).resolves.toEqual(0);
    });

    it('should return `2` exit code if formatting changed the file', async () => {
      expect.assertions(1);
      mockFormat.mockReturnValueOnce('not the argument value');
      await expect(cli.execute(['--check', '--write'])).resolves.toEqual(2);
    });

    it('should return `2` exit code if formatting would change the file', async () => {
      expect.assertions(1);
      mockFormat.mockReturnValueOnce('not the argument value');
      await expect(cli.execute(['--check'])).resolves.toEqual(2);
    });

    it('should pluralize the messaging if formatting might change multiple files', async () => {
      expect.assertions(1);
      mockGlobSync.mockReturnValueOnce(
        dirents('package1.json', 'package2.json')
      );
      mockFormat.mockImplementation(() => `foo${mockFormat.mock.calls.length}`);
      await cli.execute(['--check']);
      expect(mockConsoleLog).toHaveBeenCalledWith('2 files different.');
    });

    it('should not print the contents by default', async () => {
      expect.assertions(1);
      await cli.execute(['--check']);
      expect(mockConsoleLog).toHaveBeenCalledTimes(1);
    });

    it('should print the contents if verbose is set', async () => {
      expect.assertions(3);

      await cli.execute(['--verbose', '--check']);

      expect(mockConsoleLog).toHaveBeenCalledTimes(2);
      expect(mockConsoleLog).toHaveBeenCalledWith('{"name":"foo-0"}');
      expect(mockConsoleLog).toHaveBeenLastCalledWith('0 files different');
    });

    it('should handle errors', async () => {
      expect.assertions(1);

      mockFormat.mockImplementationOnce(() => {
        throw new Error('foo');
      });

      await expect(cli.execute(['--check'])).resolves.toEqual(1);
    });
  });
});
