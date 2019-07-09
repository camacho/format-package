const { resolve } = require('path');
const { existsSync, readFileSync } = require('fs');

const cosmiconfig = require('cosmiconfig');
const Joi = require('@hapi/joi');
const resolveFrom = require('resolve-from');

const JSON5 = require('json5');

const { JoiConfigSchema } = require('./config-schema');

const configDefault = {
  config: require('../defaults'),
  filepath: require.resolve('../defaults'),
};

const configValidate = config => {
  return Joi.validate(config, JoiConfigSchema);
};

const configModuleName = 'format-package';

const resolveModuleOrPath = ({ configPath, searchFrom }) => {
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

const searchPlaces = ({ configPath, searchFrom, moduleName }) =>
  [
    configPath && resolveModuleOrPath({ configPath, searchFrom }),
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
  const explorer = cosmiconfig(configModuleName, {
    packageProp: configModuleName,
    searchPlaces: searchPlaces({ configPath, moduleName: configModuleName }),
    stopDir: process.cwd(),
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
