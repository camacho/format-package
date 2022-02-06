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
      describe: 'Flag to write the output of ordering to the package.json file',
      type: 'boolean',
    },
    verbose: {
      alias: 'v',
      demandOption: false,
      default: false,
      describe: 'Flag to make the script print the formatted result',
      type: 'boolean',
    },
    ignore: {
      alias: 'i',
      demandOptions: false,
      default: ['**/node_modules/**'],
      describe: 'Patterns to ignore',
      type: 'array',
    },
  })
  .alias('h', 'help')
  .help()
  .strict();

const parse = (argv: string[]): Parsed => {
  // Safely cast
  return parser.parse(argv) as any;
};

export { parse as default };
