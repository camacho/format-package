import { resolve, join } from 'path';

import {
  configDefault,
  loadConfig,
  loadJson5,
  resolveModuleOrPath,
  searchPlaces,
  search,
} from '.';

const rootDir = resolve(__dirname, '../../../');
const examplesDir = join(rootDir, 'examples');

describe('config', () => {
  describe('resolveModuleOrPath', () => {
    it('should resolve a relative path', () => {
      const configPath = 'examples/format-package-property/package.json';
      const expected = `${rootDir}/${configPath}`;

      expect(resolveModuleOrPath({ configPath })).toEqual(expected);
    });

    it('should resolve an absolute path', () => {
      const configPath = `${examplesDir}/format-package-property/package.json`;

      expect(resolveModuleOrPath({ configPath })).toEqual(configPath);
    });

    it('should resolve to undefined when path does not exists', () => {
      const configPath = 'examples/format-package-property/xxx';

      expect(resolveModuleOrPath({ configPath })).toBeUndefined();
    });

    it('should resolve a module', () => {
      const configPath = 'format-package-config';
      const searchFrom = `${examplesDir}/format-package-module`;
      const received = `${searchFrom}/node_modules/${configPath}/index.js`;

      expect(resolveModuleOrPath({ configPath, searchFrom })).toEqual(received);
    });

    it('should resolve to undefined when module does not exists', () => {
      const configPath = 'format-package-config-xxx';
      const searchFrom = `${examplesDir}/format-package-module`;

      expect(resolveModuleOrPath({ configPath, searchFrom })).toBeUndefined();
    });
  });

  describe('searchPlaces', () => {
    it('should return a list with provided targetPath', () => {
      const places = searchPlaces({});

      expect(places.length).toEqual(1);
    });

    it('should return a list with provided moduleName', () => {
      const places = searchPlaces({
        moduleName: 'foo',
      });

      expect(places.length).toEqual(8);
    });
  });

  describe('loadJson5', () => {
    it('should return parse JSON5', () => {
      const configPath = `${examplesDir}/format-package-json5/format-package.json`;
      expect(loadJson5(configPath)).toBeDefined();
    });

    it('should throw on parse error', () => {
      const configPath = `${examplesDir}/format-package-json5/xxx`;
      expect(() => loadJson5(configPath)).toThrow();
    });
  });

  describe('loadConfig', () => {
    it('should return config with JSON format', () => {
      const configPath = `${examplesDir}/format-package-json/format-package.json`;

      return expect(loadConfig(configPath)).resolves.toEqual({
        config: expect.any(Object),
        filepath: configPath,
      });
    });

    it('should return config with JSON5 format', () => {
      const configPath = `${examplesDir}/format-package-json5/format-package.json`;

      return expect(loadConfig(configPath)).resolves.toEqual({
        config: expect.any(Object),
        filepath: configPath,
      });
    });
  });

  describe('search', () => {
    it('should return config', () =>
      expect(search()).resolves.toMatchObject({
        filepath: configDefault.filepath,
      }));

    it('should return default config on exception', () =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(search({ searchFrom: {} as any })).resolves.toMatchObject({
        filepath: configDefault.filepath,
        error: {
          message: 'expected filepath to be a string',
        },
      }));

    it('should return config specified with configPath', () => {
      const configPath = `${process.cwd()}/examples/format-package-json/format-package.json`;

      return expect(search({ configPath })).resolves.toMatchObject({
        filepath: configPath,
        error: null,
        config: expect.objectContaining({
          order: expect.any(Array),
        }),
      });
    });

    it('should return default when configPath fails schema validation with no order property', () => {
      const configPath = `${__dirname}/__fixtures__/invalid-config.js`;

      return expect(
        search({
          configPath,
        })
      ).resolves.toMatchObject({
        error: expect.any(Error),
        filepath: configDefault.filepath,
      });
    });

    it('should return default when configPath fails schema validation with an empty order property', () => {
      const configPath = `${__dirname}/__fixtures__/invalid-config-order.js`;

      return expect(
        search({
          configPath,
        })
      ).resolves.toMatchObject({
        error: expect.objectContaining({
          name: 'ValidationError',
        }),
        filepath: configDefault.filepath,
      });
    });

    it('should return default when configPath is not valid', () =>
      expect(
        search({
          configPath: {} as any,
        })
      ).resolves.toMatchObject({
        error: expect.objectContaining({
          name: 'Error',
        }),
        filepath: configDefault.filepath,
      }));

    it('should return when configPath passes schema validation', () => {
      const configPath = `${__dirname}/__fixtures__/valid-config-order.js`;

      return expect(
        search({
          configPath,
        })
      ).resolves.toMatchObject({
        error: null,
        filepath: configPath,
      });
    });

    it('should return config with JSON format', () => {
      const configPath = `format-package.json`;
      const searchFrom = `${examplesDir}/format-package-json`;

      return expect(
        search({
          searchFrom,
        })
      ).resolves.toMatchObject({
        error: null,
        filepath: `${searchFrom}/${configPath}`,
        config: expect.objectContaining({
          order: expect.any(Array),
        }),
      });
    });

    it('should return config with JSON5 format', () => {
      const configPath = `format-package.json`;
      const searchFrom = `${examplesDir}/format-package-json5`;

      return expect(search({ searchFrom })).resolves.toMatchObject({
        error: null,
        filepath: `${searchFrom}/${configPath}`,
        config: expect.objectContaining({
          order: expect.any(Array),
        }),
      });
    });
  });
});
