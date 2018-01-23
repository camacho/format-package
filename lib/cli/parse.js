const path = require('path');
const findUp = require('find-up');

const parser = require('yargs')('run --help')
  .command(['format [file]', '*'], 'Format package.json file', yargs => {
    const defaultPackage = path.relative('', findUp.sync('package.json'));
    const positionalArgs = {
      describe: 'package.json file to be formatted',
    };
    if (defaultPackage) positionalArgs.default = defaultPackage;
    yargs.positional('file', positionalArgs);
  })
  .options({
    c: {
      alias: 'config',
      demandOption: false,
      describe: `Location of a config file`,
      type: 'string',
    },
    w: {
      alias: 'write',
      demandOption: false,
      default: false,
      describe: 'Flag to write the output of ordering to the package.json file',
      type: 'boolean',
    },
    v: {
      alias: 'verbose',
      demandOption: false,
      default: false,
      describe: 'Flag to make the script print the formatted result',
      type: 'boolean',
    },
  })
  .help('h');

module.exports = parser.parse.bind(parser);
