/* eslint import/no-extraneous-dependencies:0 */

const stripAnsi = require('strip-ansi');
const hashAnsi = require('has-ansi');

module.exports = {
  print(val, serialize) {
    return serialize(stripAnsi(val));
  },

  test(val) {
    return val && hashAnsi(val);
  },
};
