import chalk from 'chalk';

import { LogError } from '../types';

function formatError(message) {
  return [chalk.bgRed.white(' ERROR '), message].join(' ');
}

export default function logErrorAndExit(error?: LogError) {
  if (typeof error === 'string') {
    console.error(formatError(error));
    process.exit(1);
  }
  if (error) {
    console.error(formatError(error.stderr || error.stdout || error));
    process.exit(error.code || 1);
  } else {
    // Wrapped in an else statement for testing
    console.error(formatError('Something went wrong!'));
    process.exit(1);
  }
}
