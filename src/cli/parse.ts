const parser = require('yargs')('run --help')
  .command(['format [files..]', '*'], 'Format files', yargs => {
    yargs.positional('files', {
      default: ['**/package.json'],
      describe: 'Files to be formatted (accepts globs)',
      type: 'string',
      alias: 'globs',
    });
  })
  .env('FORMAT_PACKAGE')
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
    i: {
      alias: 'ignore',
      demandOptions: false,
      default: ['**/node_modules/**'],
      describe: 'Patterns to ignore',
      type: 'array',
    },
  })
  .strict()
  .help('h');

module.exports = parser.parse.bind(parser);
