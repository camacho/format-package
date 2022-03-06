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

  if (Array.isArray(value)) {
    type OrderedAlphabetized = {
      nulls: null[];
      undefineds: undefined[];
      booleans: boolean[];
      numbers: number[];
      strings: string[];
      objects: Alphabetizable[];
    };

    const alphabetizedValues = value.map(alphabetize).reduce(
      // Once each child is ordered we can alphabetize the parent
      (acc: OrderedAlphabetized, curr) => {
        if (curr === null) {
          acc.nulls.push(curr);
        } else if (curr === undefined) {
          acc.undefineds.push(curr);
        } else if (!Number.isNaN(curr) && typeof curr === 'number') {
          acc.numbers.push(curr);
        } else if (typeof curr === 'boolean') {
          acc.booleans.push(curr);
        } else if (typeof curr === 'string') {
          acc.strings.push(curr);
        } else {
          acc.objects.push(curr);
        }

        return acc;
      },
      {
        nulls: [],
        undefineds: [],
        numbers: [],
        booleans: [],
        strings: [],
        objects: [],
      }
    ) as OrderedAlphabetized;

    // Put an order to the array top level
    // - nulls
    // - undefineds
    // - booleans sorted
    // - strings sorted alphabetically
    // - objects sorted alphabetically when
    //   turned to strings using JSON.stringify
    return [
      ...alphabetizedValues.nulls,
      ...alphabetizedValues.booleans,
      ...alphabetizedValues.numbers,
      ...alphabetizedValues.strings.sort((a: string, b: string) =>
        a.localeCompare(b)
      ),
      ...alphabetizedValues.objects.sort((a, b) =>
        JSON.stringify(a).localeCompare(JSON.stringify(b))
      ),
    ];
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
