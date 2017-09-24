#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const logErrorAndExit = require('./error');
const parseArgv = require('./argv');
const { find } = require('../utils/fs');
const format = require('../');

function execute(cwd = process.cwd()) {
  try {
    const { config, file, write, verbose } = parseArgv();
    const pkgPath = file ? path.resolve(cwd, file) : find('package.json', cwd);
    const options = config ? require(path.resolve(cwd, config)) : {};

    const prevPkg = JSON.parse(fs.readFileSync(pkgPath, { encoding: 'utf8' }));
    const nextPkg = format(prevPkg, options);

    if (write) {
      fs.writeFileSync(pkgPath, nextPkg, { encoding: 'utf8' });
      if (verbose) console.log(nextPkg);
      console.log(`✨  ${path.relative(cwd, pkgPath)} updated`);
    } else {
      console.log(nextPkg);
    }
  } catch (err) {
    logErrorAndExit(err);
  }
}

if (require.main === module) execute();
module.exports = execute;
