import type { Config, PackageJson } from '../types.ts';

import * as defaults from './defaults/index.ts';
import sort from './sort.ts';
import transform from './transform.ts';
import validate from './validate.ts';

export { defaults };

export default async function format(
  pkg: { [k: string]: PackageJson },
  options: Config = {},
  filePath?: string
) {
  const { order, transformations, formatter } = {
    ...defaults,
    ...options,
  };

  const nextKeys = sort(Object.keys(pkg), order);

  const transformedPkg = await Promise.all(
    nextKeys.map((key) => transform(key, pkg[key], transformations))
  );

  const nextPkg = transformedPkg.reduce(
    (obj, [key, value]) => Object.assign(obj, { [key]: value }),
    {}
  );

  validate(pkg, nextPkg);

  return formatter(nextPkg, filePath);
}
