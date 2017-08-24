#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const yargs = require('yargs');

const order = require('../');
const { findAndReadPkg } = require('../lib/utils/fs');

const cwd = process.cwd();

let config = {};
let packageDir = cwd;

const options = yargs
  .usage('$0 [file] <options>')
  .options({
    c: {
      alias: 'config-path',
      demandOption: false,
      describe: `Location of a config file`,
      type: 'string',
    },
    p: {
      alias: 'package-path',
      demandOption: false,
      describe: `Location where package.json file can be found`,
      default: './',
      type: 'string',
    },
    w: {
      alias: 'write',
      demandOption: false,
      default: false,
      describe: 'Flag to write the output of ordering to the package.json file',
      type: 'boolean',
    },
    q: {
      alias: 'quiet',
      demandOption: false,
      default: false,
      describe: 'Flag to make the script only output on error',
      type: 'boolean',
    },
  })
  .help().argv;

if (options.configPath) {
  config = require(path.resolve(cwd, options.configPath));
}

if (options.package) {
  packageDir = path.dirname(options.resolve(cwd, options.package));
}

const { contents: pkgContents, path: pkgPath } = findAndReadPkg(packageDir);
const pkg = JSON.parse(pkgContents);

const nextPkg = order(pkg, config).toJSON();

if (!options.quiet) {
  console.log();
  console.log(nextPkg);
  console.log();
  console.log('Package.json formatted successfully');
}

if (options.write) {
  fs.writeFile(pkgPath, [nextPkg, '\n'].join(''), err => {
    if (err) throw err;
    if (!options.quiet) {
      console.log(`Written to ${path.relative(cwd, pkgPath)}`);
    }
  });
}
