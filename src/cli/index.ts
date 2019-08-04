#!/usr/bin/env node

const path = require('path');

const fs = require('fs-extra');
const globby = require('globby');

const format = require('../');
const Timer = require('../utils/timer');

const parser = require('./parse');
const configSearch = require('./config');
const error = require('./error');

const handleFile = ({ write, verbose }, config) => async filePath => {
  const timer = new Timer();
  timer.start();

  const prevPkg = await fs.readJson(filePath, 'utf8');
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

async function execute(argv) {
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
    error(err);
  }
}

/* istanbul ignore next */
if (require.main === module) execute(process.argv.slice(2));

module.exports = {
  handleFile,
  execute,
};
