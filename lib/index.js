const defaults = require('./defaults');
const sort = require('./sort');
const transform = require('./transform');
const validate = require('./validate');

async function format(pkg, options = {}) {
  const { order, transformations, formatter } = Object.assign(
    {},
    defaults,
    options
  );

  const sortedKeys = sort(Object.keys(pkg), order);

  const transformedPkg = await Promise.all(
    sortedKeys.map(key => transform(key, pkg[key], transformations))
  );

  const nextPkg = transformedPkg.reduce(
    (obj, [key, value]) => Object.assign(obj, { [key]: value }),
    {}
  );

  validate(pkg, nextPkg);

  return formatter(nextPkg);
}

format.defaults = defaults;

module.exports = format;
