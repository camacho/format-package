import * as defaults from './defaults';
import sort from './sort';
import transform from './transform';
import validate from './validate';

export { defaults };

export default async function format(
  pkg: { [k: string]: any },
  options: { [k: string]: any } = {}
) {
  const { order, transformations, formatter } = {
    ...defaults,
    ...options,
  };

  const sortedKeys = sort(Object.keys(pkg), order);

  const transformedPkg = await Promise.all(
    sortedKeys.map((key) => transform(key, pkg[key], transformations))
  );

  const nextPkg = transformedPkg.reduce(
    (obj, [key, value]) => Object.assign(obj, { [key]: value }),
    {}
  );

  validate(pkg, nextPkg);

  return formatter(nextPkg);
}
