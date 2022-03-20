#!/usr/bin/env node

import path from 'path';

import fs from 'fs-extra';
import globby from 'globby';
import chalk from 'chalk';

import format from '../lib';
import { timer } from '../utils/timer';
import { pluralize } from '../utils/strings';

import parser from './parse';
import * as configSearch from './config';
import logError from './error';

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

    const fileContents = fs.readFileSync(filePath, 'utf8');
    const prevPkg = JSON.parse(fileContents);
    const nextPkg = await format(prevPkg, config, filePath);
    const changed = nextPkg !== fileContents;

    if (write && changed) {
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

    return changed;
  };

export async function execute(argv: string[]): Promise<number> {
  try {
    const {
      files: globs,
      config: configPath,
      ignore,
      verbose,
      write,
      check,
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
    const configuredFileHandler = handleFile({ verbose, write, check }, config);

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

    if (check) {
      if (filesChanged) {
        console.log(
          `${changedFiles.length} ${pluralize(
            'file',
            changedFiles.length
          )} different.`
        );

        return 2;
      }

      console.log('0 files different');

      // No need to proceed forward since
      // there is no information to share
      // about formatting the files
      return 0;
    }

    const relevantFiles = write ? changedFiles : files;
    const relevantAction = write ? 'Updated' : 'Formatted';

    /* istanbul ignore next */
    console.log(
      `${relevantAction} ${relevantFiles.length} ${pluralize(
        'file',
        relevantFiles.length
      )}${isDefault ? '' : ` with ${filepath}.`}`
    );
  } catch (err) {
    logError(err);
    return 1;
  }

  return 0;
}

/* istanbul ignore next */
if (require.main === module)
  execute(process.argv.slice(2)).then((exitCode) => process.exit(exitCode));
