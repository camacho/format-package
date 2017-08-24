// All transformers receive:
//   * the key they matched on
//   * the value in package.json (if any)
//   * the JSON.parsed contents of package.json
//
// And return a new value to be stored
function transformValues(keys, pkg, transformations) {
  return keys.map(name => {
    let value = pkg[name];
    if (transformations[name]) value = transformations[name](name, value, pkg);
    return [name, value];
  });
}

module.exports = transformValues;
