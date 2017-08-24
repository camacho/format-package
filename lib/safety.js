// Safety check
//   - every key from package.json is in the collection
//   - every key in the collection is in package.json

function safetyCheck(pkg, collection) {
  const map = collection.toObject();

  if (
    Object.keys(pkg).some(k => !Object.prototype.hasOwnProperty.call(map, k)) ||
    collection.some(([k]) => !Object.prototype.hasOwnProperty.call(pkg, k))
  ) {
    throw new Error(
      'Something went wrong and some keys were lost - this job was cancelled and nothing written'
    );
  }
}

module.exports = safetyCheck;
