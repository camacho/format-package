export function callbackToPromise(fn: Function): (...any) => Promise<any> {
  return (...args) =>
    new Promise((resolve, reject) => {
      fn(...args, (err, result) => (err ? reject(err) : resolve(result)));
    });
}

module.exports = { callbackToPromise };
