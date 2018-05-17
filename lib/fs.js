function read(...args) {
  const fs = require('fs');
  const { callbackToPromise } = require('./utils/promise');
  return callbackToPromise(fs.readFile)(...args);
}

function write(...args) {
  const fs = require('fs');
  const { callbackToPromise } = require('./utils/promise');
  return callbackToPromise(fs.writeFile)(...args);
}

module.exports = { read, write };
