import { resolve } from 'path';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { cosmiconfig, type CosmiconfigResult } from 'cosmiconfig';
import Joi from '@hapi/joi';
import resolveFrom from 'resolve-from';
import JSON5 from 'json5';

import type { Config } from '../../types.ts';

import { defaults } from '../../lib/index.ts';
import JoiConfigSchema from './schema.ts';

// @hapi/joi v15 does not export a ValidationError constructor — it creates plain
// Error objects and stamps `.name = 'ValidationError'` on them at runtime.
// We replicate that shape here so callers can `new ValidationError(msg)`.
class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

// Shared shape returned by both search strategies: a resolved config plus
// metadata about where it came from. All fields optional because the default
// fallback, a found file, and an empty result each populate a different subset.
export interface SearchResult {
  config?: unknown;
  filepath?: string;
  isDefault?: boolean;
  isEmpty?: boolean;
  error?: unknown;
}

export const configDefault = {
  config: defaults,
  filepath: fileURLToPath(new URL('../../lib/defaults/', import.meta.url)),
  isDefault: true,
};

export const validateConfig = (
  config: unknown
): Config & { error?: ValidationError } => {
  const result = Joi.validate(config, JoiConfigSchema);

  if (result.error) {
    return result;
  }

  if (!Array.isArray((config as Config).order)) {
    return {
      error: new ValidationError('Empty order property.'),
    };
  }

  return result;
};

export const configModuleName = 'format-package';

export const resolveModuleOrPath = ({
  configPath,
  searchFrom,
}: {
  configPath?: string;
  searchFrom?: string;
}) => {
  if (typeof configPath !== 'string') {
    return undefined;
  }

  let resolvedPath;

  // resolve as a node_modules, if undefined default to path.resolve if exists
  if (searchFrom) {
    resolvedPath = resolveFrom.silent(searchFrom, configPath);
  }

  if (!resolvedPath) {
    resolvedPath = resolve(configPath);
    resolvedPath = existsSync(resolvedPath) ? resolvedPath : undefined;
  }

  return resolvedPath;
};

export const loadJson5 = (
  filepath: string
): Promise<{ [k: string]: string | boolean }> => {
  try {
    const buf = readFileSync(filepath, { encoding: 'utf8' });
    return JSON5.parse(buf);
  } catch (err) {
    err.message = `JSON Error in ${filepath}:\n${err.message}`;
    throw err;
  }
};

const createCosmiconfigLoader = () => ({
  '.json': loadJson5,
});

export const loadConfig = async (
  configPath: string
): Promise<CosmiconfigResult> => {
  const explorer = cosmiconfig(configModuleName, {
    loaders: createCosmiconfigLoader(),
  });

  return explorer.load(configPath);
};

export const searchPlaces = ({
  moduleName,
}: {
  moduleName?: string;
}): string[] => {
  const places: string[] = [];

  if (moduleName) {
    places.push(
      `${moduleName}.js`,
      `${moduleName}.yaml`,
      `${moduleName}.yml`,
      `${moduleName}.json`,
      `${moduleName}.config.js`,
      `${moduleName}.config.yaml`,
      `${moduleName}.config.yml`
    );
  }

  places.push('package.json');
  return places;
};

const searchWithConfigPath = async ({
  configPath,
  searchFrom,
}: {
  configPath?: string;
  searchFrom: string;
}) => {
  try {
    // Find the path by looking for a dependency or a local file
    // then load and validate the configuration
    const resolvedPath = resolveModuleOrPath({ configPath, searchFrom });

    // Load and validate the configuration file contents
    const result = await loadConfig(resolvedPath);
    const { error } = validateConfig(result?.config);

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

const searchWithoutConfigPath = async ({
  searchFrom,
}: {
  searchFrom: string;
}): Promise<SearchResult> => {
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
      ({ error } = validateConfig(result.config));
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

export const search = async (
  {
    configPath,
    searchFrom = process.cwd(),
  }: {
    configPath?: string;
    searchFrom?: string;
  } = { searchFrom: process.cwd() }
): Promise<SearchResult> =>
  // Configuration loading is dependent on whether the
  // config path is given or if it has to be found
  configPath
    ? searchWithConfigPath({ configPath, searchFrom })
    : searchWithoutConfigPath({ searchFrom });
