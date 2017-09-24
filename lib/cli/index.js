#!/usr/bin/env node
const path = require('path');

const logErrorAndExit = require('./error');
const parse = require('./parse');

const fs = require('../fs');
const format = require('../');

async function execute(argv, cwd) {
  try {
    const { config, file, write, verbose } = parse(argv);

    const pkgPath = file
      ? path.resolve(cwd, file)
      : await fs.find('package.json', cwd);

    const options = config ? require(path.resolve(cwd, config)) : {};

    const prevPkgContent = await fs.read(pkgPath, 'utf8');
    const prevPkg = JSON.parse(prevPkgContent);
    const nextPkg = await format(prevPkg, options);

    if (write) {
      await fs.write(pkgPath, nextPkg, { encoding: 'utf8' });
      if (verbose) console.log(nextPkg);
      console.log(`✨  Formatted ${path.relative(cwd, pkgPath)}`);
    } else {
      console.log(nextPkg);
    }
  } catch (err) {
    logErrorAndExit(err);
  }
}

if (require.main === module) execute(process.argv.slice(2), process.cwd());
module.exports = execute;
