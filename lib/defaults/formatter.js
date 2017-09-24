function formatter(obj) {
  return [JSON.stringify(obj, null, 2), '\n'].join('');
}

module.exports = formatter;
