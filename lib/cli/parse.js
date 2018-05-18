const path = require('path');

const parser = require('yargs')('run --help')
  .command(['format [files..]', '*'], 'Format files', yargs => {
    yargs.positional('files', {
      default: ['./package.json'],
      describe: 'files to be formatted',
      type: 'string',
    });
  })
  .options({
    c: {
      alias: 'config',
      demandOption: false,
      describe: `Location of a config file`,
      type: 'string',
      transform: path.resolve,
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
