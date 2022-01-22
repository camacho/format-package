import { Config, Json } from '../types';

import * as defaults from './defaults';
import sort from './sort';
import transform from './transform';
import validate from './validate';

export { defaults };

export default async function format(
  pkg: { [k: string]: Json },
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
