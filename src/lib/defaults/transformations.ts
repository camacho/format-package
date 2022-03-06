import sortScripts from 'sort-scripts';

import { PackageJson, Transformations } from '../../types';
import { alphabetize } from '../../utils/object';

const transformations: Transformations = {
  scripts(key, prevValue) {
    const nextValue = sortScripts(prevValue).reduce(
      (obj, [name, value]) => ({ ...obj, [name]: value }),
      {}
    );

    return [key, nextValue];
  },
  // Order of exports keys matters
  // https://github.com/camacho/format-package/issues/116
  exports: (key, prevValue) => [key, prevValue],

  // Special case for all keys without defined transforms
  '*': (key, value) => [key, alphabetize(value)],
};

export default transformations;
