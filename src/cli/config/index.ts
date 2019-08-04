const { resolve } = require('path');
const { existsSync, readFileSync } = require('fs');

const cosmiconfig = require('cosmiconfig');
const Joi = require('@hapi/joi');
const { ValidationError } = require('@hapi/joi/lib/errors');
const resolveFrom = require('resolve-from');

const JSON5 = require('json5');

const { JoiConfigSchema } = require('./config-schema');

const configDefault = {
  config: require('../defaults'),
  filepath: require.resolve('../defaults'),
  isDefault: true,
};

const configValidate = config => {
  const result = Joi.validate(config, JoiConfigSchema);

  if (result.error) return result;

  if (!Array.isArray(config.order)) {
    return {
      error: new ValidationError('Empty order property.'),
    };
  }

  return result;
};

const configModuleName = 'format-package';

const resolveModuleOrPath = ({ configPath, searchFrom }) => {
  if (typeof configPath !== 'string') {
    return undefined;
  }

  // resolve as a node_modules, if undefined default to path.resolve if exists
  let resolvedPath = resolveFrom.silent(
    searchFrom || process.cwd(),
    configPath
  );

  if (typeof resolvedPath === 'undefined') {
    resolvedPath = resolve(configPath);
    resolvedPath = existsSync(resolvedPath) ? resolvedPath : undefined;
  }

  return resolvedPath;
};

const loadJson5 = filepath => {
  try {
    const buf = readFileSync(filepath, 'utf8');
    return JSON5.parse(buf);
  } catch (err) {
    err.message = `JSON Error in ${filepath}:\n${err.message}`;
    throw err;
  }
};

const createCosmiconfigLoader = () => ({
  '.json': loadJson5,
});

const loadConfig = configPath => {
  const explorer = cosmiconfig(configModuleName, {
    loaders: createCosmiconfigLoader(),
  });

  return explorer.load(configPath);
};

const searchPlaces = ({ moduleName }) =>
  [
    moduleName && `${moduleName}.js`,
    moduleName && `${moduleName}.yaml`,
    moduleName && `${moduleName}.yml`,
    moduleName && `${moduleName}.json`,
    moduleName && `${moduleName}.config.js`,
    moduleName && `${moduleName}.config.yaml`,
    moduleName && `${moduleName}.config.yml`,
    `package.json`,
  ].filter(Boolean);

const searchWithConfigPath = async ({ configPath, searchFrom }) => {
  try {
    // Find the path by looking for a dependency or a local file
    // then load and validate the configuration
    const resolvedPath = resolveModuleOrPath({ configPath, searchFrom });
    const result = await loadConfig(resolvedPath);
    const { error } = configValidate(result.config, JoiConfigSchema);

    // NOTE: This validation error handling is more strict than when a config
    //       path is not provided, as the intention is clearly expressed
    if (error) {
      throw error;
    }

    // Response must always include an error key (even if undefined)
    return {
      ...result,
      error,
    };
  } catch (error) {
    // If something went wrong, gracefully fallback
    // to default config and report the error
    return {
      ...configDefault,
      error,
    };
  }
};

const searchWithoutConfigPath = async ({ searchFrom }) => {
  // Configure the explorer with pre-defined properties above
  const explorer = cosmiconfig(configModuleName, {
    packageProp: configModuleName,
    searchPlaces: searchPlaces({ moduleName: configModuleName }),
    loaders: createCosmiconfigLoader(),
  });

  let error;
  try {
    // Search for the configuration based on config
    const result = await explorer.search(searchFrom);

    // If configuration is found, validate it and
    // include error in the response
    if (result) {
      ({ error } = configValidate(result.config, JoiConfigSchema));
      return { ...result, error };
    }
  } catch (e) {
    error = e;
  }

  // No configuration was found, so use default
  // and include any error that occured
  return {
    ...configDefault,
    error,
  };
};

const search = async ({ configPath, searchFrom } = {}) =>
  // Configuration loading is dependent on whether the
  // config path is given or if it has to be found
  configPath
    ? searchWithConfigPath({ configPath, searchFrom })
    : searchWithoutConfigPath({ searchFrom });

module.exports = {
  configDefault,
  configModuleName,
  configValidate,
  loadConfig,
  loadJson5,
  resolveModuleOrPath,
  search,
  searchPlaces,
};
