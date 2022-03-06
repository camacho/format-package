import { Alphabetizable } from '../types';

function isSortableObject(
  value: unknown
): value is { [k: string]: Alphabetizable } {
  if (!value || typeof value !== 'object') {
    return false;
  }

  // eslint-disable-next-line no-use-before-define, @typescript-eslint/no-use-before-define
  return Object.values(value).every(isAlphabetizable);
}

export function isAlphabetizable(value: unknown): value is Alphabetizable {
  return (
    value === null ||
    value === undefined ||
    typeof value === 'string' ||
    typeof value === 'boolean' ||
    (!Number.isNaN(value) && typeof value === 'number') ||
    (Array.isArray(value) && value.every(isAlphabetizable)) ||
    isSortableObject(value)
  );
}

export function alphabetize(value: unknown): Alphabetizable {
  if (!isAlphabetizable(value)) {
    throw new Error('Value is not able to be alphabetized');
  }

  if (typeof value === 'string') {
    return value;
  }

  // Don't change the order of arrays
  // as position is important
  if (Array.isArray(value)) {
    return value.map(alphabetize);
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
