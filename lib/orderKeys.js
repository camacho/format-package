// Receives the contents of `package.json` and returns an array of [pkgKey, value]
function orderPackageKeys(pkg, order) {
  const pkgKeys = Object.keys(pkg);

  // What keys are in the package.json file but not in the order list?
  const sortedUnassignedKeys = pkgKeys.filter(k => order.indexOf(k) === -1).sort();

  // Only worry about keys that are in the orderList AND in the package.json file
  const releaventOrderedKeys = order.filter(k => k === '...rest' || pkgKeys.indexOf(k) !== -1);

  // We need a place to put the package.json keys that aren't in the ordered list
  // If the order list has a special `...rest` string in it, we will insert the
  // extra keys there - otherwise put at the end of the list
  let restIndex = releaventOrderedKeys.indexOf('...rest');
  let restCut = 1;
  if (restIndex === -1) {
    restIndex = releaventOrderedKeys.length;
    restCut = 0;
  }

  // mutating the object :/
  releaventOrderedKeys.splice(
    restIndex,
    restCut,
    ...sortedUnassignedKeys
  );

  return releaventOrderedKeys;
}

module.exports = orderPackageKeys;
