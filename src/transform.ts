export interface Transformation {
  (key: string, prevValue: string): [string, string];
}
export interface Transformations {
  [key: string]: Transformation;
}

// All transformers receive:
//   * the key they matched on
//   * the value in package.json (if any)
//
// Return a new key and value to be stored
export default async function transform(
  prevKey: string,
  prevValue: string,
  transformations: Transformations = {}
): Promise<[string, string]> {
  const { alphabetize, has } = require('./utils/object');

  let nextKey = prevKey;
  let nextValue = prevValue;

  if (has(transformations, prevKey)) {
    [nextKey, nextValue] = await transformations[prevKey](prevKey, prevValue);
  } else if (typeof prevValue === 'object') {
    nextValue = await alphabetize(prevValue);
  }

  return [nextKey, nextValue];
}
