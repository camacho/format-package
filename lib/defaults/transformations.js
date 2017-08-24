const sortScripts = require('sort-scripts');
const { sort: sortObj } = require('../utils/object');

const transformations = {
  scripts(key, value) {
    return sortScripts(value)
      .reduce((obj, [name, script]) => {
        obj[name] = script;
        return obj;
      }, {});
  },
  dependencies(key, value) {
    return sortObj(value);
  },
  devDependencies(key, value) {
    return sortObj(value)
  },
  peerDependencies(key, value) {
    return sortObj(value)
  },
  optionalDependencies(key, value) {
    return sortObj(value)
  },
  engines(key, value) {
    return sortObj(value)
  }
}

module.exports = transformations;
