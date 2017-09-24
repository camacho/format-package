const { has } = require('./utils/object');

// Safety check
//   - every key from previous package.json is in the next package.json
//   - every key in the next package.json is in the previous package.json

function validate(prevPkg, nextPkg) {
  const prevAccountedFor = Object.keys(prevPkg).every(k => has(nextPkg, k));
  const nextAccountedFor = Object.keys(nextPkg).every(k => has(prevPkg, k));

  if (prevAccountedFor && nextAccountedFor) return;

  throw new Error(
    'Something went wrong and some keys were lost - this job was cancelled and nothing written'
  );
}

module.exports = validate;
