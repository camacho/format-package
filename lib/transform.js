const { alphabetize, has } = require('./utils/object');

// All transformers receive:
//   * the key they matched on
//   * the value in package.json (if any)
//
// Return a new key and value to be stored
function transform(prevKey, prevValue, transformations = {}) {
  let nextKey = prevKey;
  let nextValue = prevValue;

  if (has(transformations, prevKey)) {
    [nextKey, nextValue] = transformations[prevKey](prevKey, prevValue);
  } else if (typeof prevValue === 'object') {
    nextValue = alphabetize(prevValue);
  }

  return [nextKey, nextValue];
}

module.exports = transform;
