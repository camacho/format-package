#!/usr/bin/env node

import * as path from 'path';

import * as fs from 'fs-extra';
import * as globby from 'globby';

import format from '../';
import Timer from '../utils/timer';

import parser from './parse';
import * as configSearch from './config';
import logErrorAndExit from './error';

export const handleFile = ({ write, verbose }, config) => async filePath => {
  const timer = new Timer();
  timer.start();

  const prevPkg = fs.readJsonSync(filePath, { encoding: 'utf8' });
  const nextPkg = await format(prevPkg, config);

  if (write) {
    await fs.writeFile(filePath, nextPkg, { encoding: 'utf8' });
  }

  const elapsed = timer.end();

  if (verbose || !write) {
    console.log(nextPkg);
  } else {
    console.log(
      `${path.relative('', filePath)} (${elapsed.milliseconds.toFixed(2)}ms)`
    );
  }
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
      onlyFiles: true,
      ignore,
      absolute: true,
    });

    await Promise.all(
      files.map(file => path.resolve(file)).map(handleFile(options, config))
    );

    /* istanbul ignore next */
    console.log(
      `✏️   Formatted ${files.length} file${files.length === 1 ? '' : 's'}${
        isDefault ? '.' : ` with ${filepath}.`
      }`
    );
  } catch (err) {
    logErrorAndExit(err);
  }
}

/* istanbul ignore next */
if (require.main === module) execute(process.argv.slice(2));
