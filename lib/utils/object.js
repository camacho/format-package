function sort(obj) {
  return Object.keys(obj).sort().reduce((next, key) => {
    let value = obj[key];
    if (!Array.isArray(value) && typeof value === 'object') {
      value = sort(value);
    }
    next[key] = value;
    return next;
  }, {});
}

module.exports = { sort };
