import path from 'path';
import { globSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { execute } from '../../src/cli/index.ts';

const { mockWriteFile } = vi.hoisted(() => ({ mockWriteFile: vi.fn() }));

// globSync/readFileSync stay real (enumerate + read fixtures); only the write
// is mocked so formatted output is captured for snapshots without disk I/O.
vi.mock('node:fs', async (importOriginal) => {
  const actual = await importOriginal<typeof import('node:fs')>();
  return { ...actual, writeFileSync: mockWriteFile };
});

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const fixtures = globSync('*.json', {
  cwd: __dirname,
});

describe('Fixtures', () => {
  const processExit = process.exit;
  let mockConsoleLog;
  let mockConsoleError;
  let mockProcessExit;

  beforeAll(() => {
    mockConsoleLog = vi.spyOn(console, 'log').mockReturnValue(undefined);
    mockConsoleError = vi.spyOn(console, 'error').mockReturnValue(undefined);
    mockWriteFile.mockReturnValue(undefined);
    mockProcessExit = vi.fn();
    Object.defineProperty(process, 'exit', { value: mockProcessExit });
  });

  beforeEach(async () => {
    mockConsoleLog.mockClear();
    mockConsoleError.mockClear();
    mockWriteFile.mockClear();
    mockProcessExit.mockClear();
  });

  afterAll(() => {
    Object.defineProperty(process, 'exit', processExit);
    mockConsoleLog.mockRestore();
    mockConsoleError.mockRestore();
  });

  describe.each(fixtures)(`Formatting "%s"`, (filename) => {
    const filepath = path.join(__dirname, filename);
    it(`produces an expected output`, async () => {
      expect.assertions(3);

      await execute([filepath, '-w']);

      expect(mockWriteFile).toHaveBeenCalledTimes(1);
      expect(mockWriteFile.mock.calls[0][0]).toEqual(filepath);
      expect(mockWriteFile.mock.calls[0][1]).toMatchSnapshot(filename);
    });

    it(`does not throw an error`, async () => {
      expect.assertions(2);
      await execute([filepath]);
      expect(console.error).not.toHaveBeenCalled();
      expect(process.exit).not.toHaveBeenCalled();
    });
  });
});
