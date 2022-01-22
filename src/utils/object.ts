import { PackageJson } from '../types';

import { isStringArray } from './strings';

function isSortableObject(
  value: unknown
): value is { [k: string]: PackageJson } {
  if (!value || typeof value !== 'object') {
    return false;
  }

  // eslint-disable-next-line no-use-before-define, @typescript-eslint/no-use-before-define
  return Object.values(value).every(isAlphabetizable);
}

export function isAlphabetizable(value: unknown): value is PackageJson {
  return (
    typeof value === 'string' || isStringArray(value) || isSortableObject(value)
  );
}

export function alphabetize(value: PackageJson): typeof value {
  if (typeof value === 'string' || !isAlphabetizable(value)) {
    return value;
  }

  if (isStringArray(value)) {
    return value
      .filter((a, b, c) => b === c.indexOf(a))
      .sort((a: string, b: string) => a.localeCompare(b));
  }

  if (Array.isArray(value)) {
    return value
      .map(alphabetize)
      .sort((a: string, b: string) => a.localeCompare(b));
  }

  if (isSortableObject(value)) {
    return Object.keys(value)
      .sort((a: string, b: string) => a.localeCompare(b))
      .reduce(
        (acc, key: string) => ({
          ...acc,
          [key]: alphabetize(value[key]),
        }),

        {}
      );
  }

  return value;
}
