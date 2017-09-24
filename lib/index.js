const defaults = require('./defaults');
const sort = require('./sort');
const transform = require('./transform');
const validate = require('./validate');

function format(prevPkg, options = {}) {
  const { order, transformations, formatter } = Object.assign(
    {},
    defaults,
    options
  );

  const nextPkg = sort(Object.keys(prevPkg), order)
    .map(key => [key, prevPkg[key]])
    .map(([key, value]) => transform(key, value, transformations))
    .reduce((obj, [key, value]) => Object.assign(obj, { [key]: value }), {});

  validate(prevPkg, nextPkg);

  return formatter(nextPkg);
}

format.defaults = defaults;

module.exports = format;
