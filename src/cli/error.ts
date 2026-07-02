import { styleText } from 'node:util';

import type { LogError } from '../types.ts';

function formatError(message) {
  return [styleText(['bgRed', 'white'], ' ERROR '), message].join(' ');
}

export default function logError(error?: LogError): void {
  if (typeof error === 'string') {
    console.error(formatError(error));
    return;
  }

  if (error) {
    console.error(formatError(`${error.name}: ${error.message}`));
    return;
  }
  // Wrapped in an else statement for testing
  console.error(formatError('Something went wrong!'));
}
