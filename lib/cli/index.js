#!/usr/bin/env node
const handleFile = ({ write, verbose }, config) => async filePath => {
  const path = require('path');

  const fs = require('../fs');
  const format = require('../');

  const Timer = require('../utils/timer');
  const timer = new Timer();
  timer.start();

  const prevPkgContent = await fs.read(filePath, 'utf8');
  const prevPkg = JSON.parse(prevPkgContent);
  const nextPkg = await format(prevPkg, config);

  if (write) {
    await fs.write(filePath, nextPkg, { encoding: 'utf8' });
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
    const path = require('path');

    const Timer = require('../utils/timer');
    const timer = new Timer();
    timer.start();

    const { globs, config: configPath, ...options } = require('./parse')(argv);

    const config = configPath ? require(configPath) : {};

    const files = await require('globby')(globs, {
      onlyFiles: true,
      ignore: ['**/node_modules/**'],
      absolute: true,
    });

    await Promise.all(
      files.map(file => path.resolve(file)).map(handleFile(options, config))
    );

    console.log(
      `✏️   Formatted ${files.length} file${files.length === 1 ? '' : 's'}`
    );
  } catch (err) {
    require('./error')(err);
  }
}

if (require.main === module) execute(process.argv.slice(2));
module.exports = execute;
