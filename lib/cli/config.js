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
      error: new ValidationError('empty order property'),
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

const search = async ({ configPath, searchFrom } = {}) => {
  if (configPath) {
    const resolvedPath = resolveModuleOrPath({ configPath, searchFrom });
    return loadConfig(resolvedPath)
      .then(result => {
        const { error } = configValidate(result.config, JoiConfigSchema);

        if (error) {
          throw error;
        }

        return {
          ...result,
          error,
        };
      })
      .catch(error => {
        return {
          ...configDefault,
          error,
        };
      });
  }

  const explorer = cosmiconfig(configModuleName, {
    packageProp: configModuleName,
    searchPlaces: searchPlaces({ moduleName: configModuleName }),
    loaders: createCosmiconfigLoader(),
  });

  return explorer
    .search(searchFrom)
    .then(result => {
      const { error } = result
        ? configValidate(result.config, JoiConfigSchema)
        : { error: undefined };
      return {
        ...(result || configDefault),
        error,
      };
    })
    .catch(error => {
      return {
        ...configDefault,
        error,
      };
    });
};

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
