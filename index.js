const defaults = require('./lib/defaults');
const orderPackageKeys = require('./lib/orderKeys');
const transformValues = require('./lib/transformValues');
const safetyCheck = require('./lib/safety');

function formatPackage(pkg, options = {}) {
  const { order, transformations } = Object.assign({}, defaults, options);

  const orderedKeys = orderPackageKeys(pkg, order);

  const collection = transformValues(orderedKeys, pkg, transformations);

  const map = collection.reduce((obj, [key, value]) => {
    // eslint-disable-next-line no-param-reassign
    obj[key] = value;
    return obj;
  }, {});

  map.toArray = () => collection;
  collection.toObject = () => map;
  collection.toJSON = (_, space = 2) => JSON.stringify(map, _, space);

  safetyCheck(pkg, collection);

  return collection;
}

formatPackage.defaults = {
  order: defaults.order.slice(),
  transformations: Object.assign({}, defaults.transformations),
};

module.exports = formatPackage;
