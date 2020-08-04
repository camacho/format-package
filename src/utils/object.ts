export function alphabetize(obj: any): { [k: string]: any } {
  if (typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((entry) => alphabetize(entry));
  }

  return Object.keys(obj)
    .sort()
    .reduce(
      (nextObj, key) =>
        Object.assign(nextObj, { [key]: alphabetize(obj[key]) }),
      {}
    );
}

export function has(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}
