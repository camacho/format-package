const fs = require('fs');
const path = require('path');
const findup = require('findup');

// Starting with a directory (or the process directory if none is provided)
// Look till `package.json` is found and return absolute path
function findPkg(startingDir = process.cwd()) {
  try {
    const dir = findup.sync(startingDir, 'package.json');
    return path.join(dir, 'package.json');
  } catch (err) {
    throw new Error('No package.json file found');
  }
}

// Since we are executing from the command line
// it feels fairly safe to use sync - might revisit
function findAndReadPkg(startingDir = process.cwd()) {
  const pkgPath = findPkg(startingDir);
  return {
    path: pkgPath,
    contents: fs.readFileSync(pkgPath)
  }
}

module.exports = { findPkg, findAndReadPkg };
