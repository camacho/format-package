const sortScripts = require('sort-scripts');

const transformations = {
  scripts(key, value) {
    return sortScripts(value).reduce((obj, [name, script]) => {
      obj[name] = script;
      return obj;
    }, {});
  },
};

module.exports = transformations;
