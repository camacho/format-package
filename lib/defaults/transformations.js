const sortScripts = require('sort-scripts');

const transformations = {
  scripts(key, prevValue) {
    const nextValue = sortScripts(prevValue).reduce(
      (obj, [name, value]) => Object.assign({}, obj, { [name]: value }),
      {}
    );

    return [key, nextValue];
  },
};

module.exports = transformations;
