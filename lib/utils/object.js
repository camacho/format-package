function sort(obj) {
  if (typeof value !== 'object') return obj;

  if (Array.isArray(obj)) return obj.map(entry => sort(entry));

  return Object.keys(obj).sort().reduce((next, key) => {
    next[key] = sort(obj[key]);
    return next;
  }, {});
}

module.exports = { sort };
