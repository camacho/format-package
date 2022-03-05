#!/usr/bin/env node

import path from 'path';

import fs from 'fs-extra';
import globby from 'globby';

import format from '../lib';
import { timer } from '../utils/timer';
import { pluralize } from '../utils/strings';

import parser from './parse';
import * as configSearch from './config';
import logErrorAndExit from './error';
import chalk from 'chalk';

export const handleFile =
  (
    {
      write,
      verbose,
      check,
    }: {
      write: boolean;
      verbose: boolean;
      check: boolean;
    },
    config
  ) =>
  async (filePath: string): Promise<boolean> => {
    const endTimer = timer()();

    const prevPkg = fs.readJSONSync(filePath, { encoding: 'utf8' });
    const nextPkg = await format(prevPkg, config, filePath);

    if (write) {
      fs.writeFileSync(filePath, nextPkg, 'utf8');
    }

    const elapsed = endTimer();

    // Only console if explicitly declared OR
    // content is not being written and there
    // is no check that content has changed
    if (verbose || (!write && !check)) {
      console.log(nextPkg);
    } else if (!check) {
      console.log(
        `${chalk.gray(
          path.relative('', filePath)
        )} ${elapsed.milliseconds.toFixed(0)}ms`
      );
    }

    // This checks the content of the package is structured the same
    // but it does not check the formatting
    return JSON.stringify(nextPkg) !== JSON.stringify(prevPkg);
  };

export async function execute(argv: string[]): Promise<number> {
  try {
    const {
      files: globs,
      config: configPath,
      ignore,
      ...options
    } = parser(argv);

    const { config, filepath, isDefault } = await configSearch.search({
      configPath,
    });

    const files = await globby(globs, {
      cwd: process.cwd(),
      onlyFiles: true,
      ignore,
      absolute: true,
    });

    // Handle all files and get a list of
    // those whose contents would/did change
    const configuredFileHandler = handleFile(options, config);

    const changedFiles = (
      await Promise.all(
        files
          .map((file) => path.resolve(file))
          .map(async (filePath) => {
            const resolvedFilePath = path.resolve(filePath);
            const changed = await configuredFileHandler(resolvedFilePath);
            return {
              changed,
              filePath: resolvedFilePath,
            };
          })
      )
    ).filter(({ changed }) => changed);

    const filesChanged = Boolean(changedFiles.length);

    if (options.check) {
      if (filesChanged) {
        logErrorAndExit(
          `${changedFiles.length} ${pluralize(
            'file',
            changedFiles.length
          )} different.`,
          2
        );

        return 2;
      }

      console.log('0 files changed');

      // No need to proceed forward since
      // there is no information to share
      // about formatting the files
      return 0;
    }

    /* istanbul ignore next */
    console.log(
      `Formatted ${files.length} ${pluralize('file', files.length)}${
        isDefault ? '' : ` with ${filepath}.`
      }`
    );
  } catch (err) {
    console.log('got here');
    logErrorAndExit(err, 1);
    return 1;
  }

  return 0;
}

/* istanbul ignore next */
if (require.main === module)
  execute(process.argv.slice(2)).then((exitCode) => process.exit(exitCode));
