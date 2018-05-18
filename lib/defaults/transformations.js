const transformations = {
  scripts(key, prevValue) {
    const nextValue = require('sort-scripts')(prevValue).reduce(
      (obj, [name, value]) => Object.assign({}, obj, { [name]: value }),
      {}
    );

    return [key, nextValue];
  },
};

module.exports = transformations;
