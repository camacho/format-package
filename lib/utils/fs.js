const path = require('path');
const findup = require('findup');

// Starting with a directory (or the process directory if none is provided)
// Look till `package.json` is found and return absolute path
function find(file, startingDir = process.cwd()) {
  try {
    const dir = findup.sync(startingDir, file);
    return path.join(dir, file);
  } catch (err) {
    throw new Error(`No ${file} file found`);
  }
}

module.exports = { find };
