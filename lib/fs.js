const fs = require('fs');
const findup = require('find-up');
const { callbackToPromise } = require('./utils/promise');

// Starting with a directory (or the process directory if none is provided)
// Look till `package.json` is found and return absolute path
async function find(file, cwd = process.cwd()) {
  const path = await findup(file, { cwd });
  if (!path) throw new Error(`No ${file} file found`);
  return path;
}

async function read(...args) {
  return callbackToPromise(fs.readFile)(...args);
}

async function write(...args) {
  return callbackToPromise(fs.writeFile)(...args);
}

module.exports = { find, read, write };
