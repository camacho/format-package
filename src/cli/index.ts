#!/usr/bin/env node

import * as path from 'path';

import * as fs from 'fs-extra';
import * as globby from 'globby';

import format from '../lib';
import Timer from '../utils/timer';

import parser from './parse';
import * as configSearch from './config';
import logErrorAndExit from './error';

export const handleFile = ({ write, verbose, check }, config) => async (
  filePath
) => {
  const timer = new Timer();
  timer.start();

  const prevPkg = fs.readJSONSync(filePath, { encoding: 'utf8' });

  const nextPkg = await format(prevPkg, config, filePath);

  if (write) {
    fs.writeFileSync(filePath, nextPkg, 'utf8');
  }

  const elapsed = timer.end();

  if (verbose || (!write && !check)) {
    console.log(nextPkg);
  } else {
    console.log(
      `${path.relative('', filePath)} (${elapsed.milliseconds.toFixed(2)}ms)`
    );
  }
  if (check) {
    return JSON.stringify(nextPkg) !== JSON.stringify(prevPkg);
  }
  return false;
};

export async function execute(argv: string[]) {
  try {
    const timer = new Timer();
    timer.start();

    const { globs, config: configPath, ignore, ...options } = parser(argv);

    const { config, filepath, isDefault } = await configSearch.search({
      configPath,
    });

    const files = await globby(globs, {
      cwd: process.cwd(),
      onlyFiles: true,
      ignore,
      absolute: true,
    });

    const checkChanged = await Promise.all(
      files.map((file) => path.resolve(file)).map(handleFile(options, config))
    );

    /* istanbul ignore next */
    console.log(
      `✏️   Formatted ${files.length} file${files.length === 1 ? '' : 's'}${
        isDefault ? '.' : ` with ${filepath}.`
      }`
    );

    if (checkChanged.includes(true)) {
      return 1;
    }
    return 0;
  } catch (err) {
    logErrorAndExit(err);
    return 2;
  }
}

/* istanbul ignore next */
if (require.main === module)
  execute(process.argv.slice(2)).then((exitCode) => process.exit(exitCode));
