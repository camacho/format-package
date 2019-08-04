const { resolve } = require('path');

const {
  configDefault,
  loadConfig,
  loadJson5,
  resolveModuleOrPath,
  searchPlaces,
  search,
} = require('./config');

describe('config', () => {
  describe('resolveModuleOrPath', () => {
    it('should resolve a relative path', () => {
      const configPath = 'examples/format-package-property/package.json';
      const expected = resolve(`${process.cwd()}/${configPath}`);

      expect(resolveModuleOrPath({ configPath })).toEqual(expected);
    });

    it('should resolve an absolute path', () => {
      const configPath = `${process.cwd()}/examples/format-package-property/package.json`;

      expect(resolveModuleOrPath({ configPath })).toEqual(configPath);
    });

    it('should resolve to undefined when path does not exists', () => {
      const configPath = 'examples/format-package-property/xxx';

      expect(resolveModuleOrPath({ configPath })).toBeUndefined();
    });

    it('should resolve a module', () => {
      const configPath = 'format-package-config';
      const searchFrom = `${process.cwd()}/examples/format-package-module`;
      const received = `${searchFrom}/node_modules/${configPath}/index.js`;

      expect(resolveModuleOrPath({ configPath, searchFrom })).toEqual(received);
    });

    it('should resolve to undefined when module does not exists', () => {
      const configPath = 'format-package-config-xxx';
      const searchFrom = `${process.cwd()}/examples/format-package-module`;

      expect(resolveModuleOrPath({ configPath, searchFrom })).toBeUndefined();
    });
  });

  describe('searchPlaces', () => {
    it('should return a list with provided targetPath', () => {
      const places = searchPlaces({
        configPath: 'format-package-config',
        searchFrom: `${process.cwd()}/examples/format-package-module`,
      });

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
      expect.assertions(1);
      const configPath = `${process.cwd()}/examples/format-package-json5/format-package.json`;

      try {
        const json = loadJson5(configPath);
        expect(json).toBeDefined();
      } catch (e) {
        expect(e).toBeUndefined();
      }
    });

    it('should throw on parse error', () => {
      expect.assertions(1);

      const configPath = `${process.cwd()}/examples/format-package-json5/xxx`;

      try {
        const json = loadJson5(configPath);
        expect(json).toBeUndefined();
      } catch (e) {
        expect(e).toBeDefined();
      }
    });
  });

  describe('loadConfig', () => {
    it('should return config with JSON format', () => {
      const configPath = `${process.cwd()}/examples/format-package-json/format-package.json`;

      return expect(loadConfig(configPath)).resolves.toEqual({
        config: expect.any(Object),
        filepath: configPath,
      });
    });

    it('should return config with JSON5 format', () => {
      const configPath = `${process.cwd()}/examples/format-package-json5/format-package.json`;

      return expect(loadConfig(configPath)).resolves.toEqual({
        config: expect.any(Object),
        filepath: configPath,
      });
    });
  });

  describe('search', () => {
    it('should return config', () => {
      return expect(search()).resolves.toMatchObject({
        filepath: configDefault.filepath,
      });
    });

    it('should return default config on exception', () => {
      return expect(search({ searchFrom: {} })).resolves.toMatchObject({
        filepath: configDefault.filepath,
        error: {
          message: 'expected filepath to be a string',
        },
      });
    });

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

    it('should return default when configPath is not valid', () => {
      return expect(
        search({
          configPath: {},
        })
      ).resolves.toMatchObject({
        error: expect.objectContaining({
          name: 'Error',
        }),
        filepath: configDefault.filepath,
      });
    });

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
      const searchFrom = `${process.cwd()}/examples/format-package-json`;

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
      const searchFrom = `${process.cwd()}/examples/format-package-json5`;

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
