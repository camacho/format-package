const order = require('./order');
const transformations = require('./transformations');
const formatter = require('./formatter');

module.exports = {
  order: order.slice(),
  transformations: Object.assign({}, transformations),
  formatter: (...args) => formatter(...args),
};
