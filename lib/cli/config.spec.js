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
    it('should return parse JSON5', async () => {
      expect.assertions(1);
      const configPath = `${process.cwd()}/examples/format-package-json5/format-package.json`;

      try {
        const json = loadJson5(configPath);
        expect(json).toBeDefined();
      } catch (e) {
        expect(e).toBeUndefined();
      }
    });

    it('should throw on parse error', async () => {
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
    it('should return config with JSON format', async () => {
      expect.assertions(2);
      const configPath = `${process.cwd()}/examples/format-package-json/format-package.json`;
      const result = await loadConfig(configPath);

      expect(result.error).toBeUndefined();
      expect(result.filepath).toEqual(configPath);
    });

    it('should return config with JSON5 format', async () => {
      expect.assertions(2);
      const configPath = `${process.cwd()}/examples/format-package-json5/format-package.json`;
      const result = await loadConfig(configPath);

      expect(result.error).toBeUndefined();
      expect(result.filepath).toEqual(configPath);
    });
  });

  describe('search', () => {
    it('should return config', async () => {
      expect.assertions(1);
      const result = await search();
      expect(result.filepath).toEqual(configDefault.filepath);
    });

    it('should return default config on exception', async () => {
      expect.assertions(3);
      const result = await search({
        searchFrom: {},
      });
      expect(result.filepath).toEqual(configDefault.filepath);
      expect(result.error).toBeDefined();
      expect(result.error.message).toEqual('expected filepath to be a string');
    });

    it('should return config specified with configPath', async () => {
      expect.assertions(4);

      const configPath = `${process.cwd()}/examples/format-package-json/format-package.json`;
      const result = await search({
        configPath,
      });

      expect(result.error).toBeNull();
      expect(result.filepath).toEqual(configPath);
      expect(result.config).toBeDefined();
      expect(result.config).toHaveProperty('order');
    });

    it('should return default when configPath fails schema validation with no order property', async () => {
      expect.assertions(2);

      const configPath = `${__dirname}/__fixtures__/invalid-config.js`;
      const result = await search({
        configPath,
      });

      expect(result.error).toBeDefined();
      expect(result.filepath).toEqual(configDefault.filepath);
    });

    it('should return default when configPath fails schema validation with an empty order property', async () => {
      expect.assertions(3);

      const configPath = `${__dirname}/__fixtures__/invalid-config-order.js`;
      const result = await search({
        configPath,
      });

      expect(result.error).toBeDefined();
      expect(result.error.name).toEqual('ValidationError');
      expect(result.filepath).toEqual(configDefault.filepath);
    });

    it('should return default when configPath is not valid', async () => {
      expect.assertions(3);

      const result = await search({
        configPath: {},
      });

      expect(result.error).toBeDefined();
      expect(result.error.name).toEqual('Error');
      expect(result.filepath).toEqual(configDefault.filepath);
    });

    it('should return when configPath passes schema validation', async () => {
      expect.assertions(2);

      const configPath = `${__dirname}/__fixtures__/valid-config-order.js`;
      const result = await search({
        configPath,
      });

      expect(result.error).toBeNull();
      expect(result.filepath).toEqual(configPath);
    });

    it('should return config with JSON format', async () => {
      expect.assertions(4);

      const configPath = `format-package.json`;
      const searchFrom = `${process.cwd()}/examples/format-package-json`;
      const result = await search({
        searchFrom,
      });

      expect(result.error).toBeNull();
      expect(result.filepath).toEqual(`${searchFrom}/${configPath}`);
      expect(result.config).toBeDefined();
      expect(result.config).toHaveProperty('order');
    });

    it('should return config with JSON5 format', async () => {
      expect.assertions(4);

      const configPath = `format-package.json`;
      const searchFrom = `${process.cwd()}/examples/format-package-json5`;
      const result = await search({
        searchFrom,
      });

      expect(result.error).toBeNull();
      expect(result.filepath).toEqual(`${searchFrom}/${configPath}`);
      expect(result.config).toBeDefined();
      expect(result.config).toHaveProperty('order');
    });
  });
});
