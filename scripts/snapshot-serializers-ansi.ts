/* eslint import/no-extraneous-dependencies:0 */
import stripAnsi from 'strip-ansi';
import * as hasAnsi from 'has-ansi';

export function print(val: string, serialize: (string) => string): string {
  return serialize(stripAnsi(val));
}

export function test(val: string): boolean {
  return !!(val && hasAnsi(val));
}
