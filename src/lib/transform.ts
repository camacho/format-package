import { Transformations, Json } from '../types';

import { alphabetize } from '../utils/object';

// All transformers receive:
//   * the key they matched on
//   * the value in package.Json (if any)
//
// Return a new key and value to be stored
export default async function transform(
  prevKey: string,
  prevValue: Json,
  transformations: Transformations = {}
): Promise<[string, Json]> {
  let nextKey = prevKey;
  let nextValue = prevValue;

  if (prevKey in transformations) {
    [nextKey, nextValue] = await transformations[prevKey](prevKey, prevValue);
  } else if (typeof prevValue === 'object') {
    nextValue = alphabetize(prevValue);
  }

  return [nextKey, nextValue];
}
