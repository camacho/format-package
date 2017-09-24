const yargs = require('yargs');

const parser = yargs
  .command(['format [file]', '*'], 'Format closest package.json file')
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
