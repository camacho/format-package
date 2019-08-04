// Receives the contents of `package.json` and returns an array of [pkgKey, value]
function sort(keys, order, restKey = '...rest') {
  // What keys are in the package.json file but not in the order list?
  const sortedKeys = keys.filter(k => order.indexOf(k) === -1).sort();

  // Only worry about keys that are in the orderList AND in the keys array
  const orderedKeys = order.filter(
    k => k === '...rest' || keys.indexOf(k) !== -1
  );

  // We need a place to put the keys that aren't in the ordered list
  // If the order list has a special `...rest` string in it, we will insert the
  // extra keys there - otherwise put at the end of the list
  let restIndex = orderedKeys.indexOf(restKey);
  let restCut = 1;

  if (restIndex === -1) {
    restIndex = orderedKeys.length;
    restCut = 0;
  }

  orderedKeys.splice(restIndex, restCut, ...sortedKeys);

  return orderedKeys;
}

module.exports = sort;
