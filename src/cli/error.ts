import chalk from 'chalk';

import { LogError } from '../types';

function formatError(message) {
  return [chalk.bgRed.white(' ERROR '), message].join(' ');
}

export default function logErrorAndExit(error?: LogError, exitCode = 1): void {
  if (typeof error === 'string') {
    console.error(formatError(error));
    process.exit(exitCode);
  }

  if (error) {
    console.error(
      formatError(
        error.stderr?.trim() ||
          error.stdout?.trim() ||
          // error.stack?.split('\n')[2].trim() ||
          error
      )
    );
    process.exit(error.code ?? exitCode);
  } else {
    // Wrapped in an else statement for testing
    console.error(formatError('Something went wrong!'));
    process.exit(exitCode);
  }
}
