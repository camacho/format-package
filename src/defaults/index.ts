const order = require('./order.json');
const transformations = require('./transformations');
const formatter = require('./formatter');

module.exports = {
  order: order.slice(),
  transformations: Object.assign({}, transformations),
  formatter,
};
