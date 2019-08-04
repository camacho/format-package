import chalk from 'chalk';

export type LogError =
  | Error & {
      stderr?: string;
      stdout?: string;
      code?: number;
    }
  | { stderr?: string; stdout?: string; code?: number };

function formatError(message) {
  return [chalk.bgRed.white(' ERROR '), message].join(' ');
}

export default function logErrorAndExit(error?: LogError) {
  if (error) {
    console.error(formatError(error.stderr || error.stdout || error));
    process.exit(error.code || 1);
  } else {
    // Wrapped in an else statement for testing
    console.error(formatError('Something went wrong!'));
    process.exit(1);
  }
}
