function sort(value){
  return Object.keys(value)
    .sort()
    .reduce((obj, key) => {
      obj[key] = value[key];
      return obj;
    }, {});
}

module.exports = { sort }
