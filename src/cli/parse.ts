import * as yargs from 'yargs';

interface Parsed {
  globs: string[];
  files: string[];
  config: string | undefined;
  write: boolean;
  verbose: boolean;
  check: boolean;
  ignore: string[];
  _: string[];
  $0: string;
}

const parser = yargs
  .command(['format [files..]', '*'], 'Format files', (commandYargs) =>
    commandYargs.positional('files', {
      default: ['**/package.json'],
      describe: 'Files to be formatted (accepts globs)',
      type: 'string',
      alias: 'globs',
    })
  )
  .env('FORMAT_PACKAGE')
  .options({
    config: {
      alias: 'c',
      demandOption: false,
      describe: `Location of a config file`,
      type: 'string',
    },
    check: {
      demandOption: false,
      default: false,
      describe: `Return a non-0 exit code if formatting has an effect on one or more files`,
      type: 'boolean',
    },
    write: {
      alias: 'w',
      demandOption: false,
      default: false,
      describe: 'Write the output of ordering to the package.json file',
      type: 'boolean',
    },
    verbose: {
      alias: 'v',
      demandOption: false,
      default: false,
      describe: 'Print the formatted file results',
      type: 'boolean',
    },
    // For future options
    // quiet: {
    //   alias: 'q',
    //   demandOption: false,
    //   default: false,
    //   describe: 'Prevent the script from printing any output',
    //   type: 'boolean',
    // },
    ignore: {
      alias: 'i',
      demandOptions: false,
      default: ['**/node_modules/**'],
      describe: 'Patterns to ignore',
      type: 'array',
    },
  })
  // For future options
  // .conflicts('verbose', 'quiet')
  .alias('h', 'help')
  .help()
  .strict();

const parse = (argv: string[]) => parser.parse(argv);
export default parse;
