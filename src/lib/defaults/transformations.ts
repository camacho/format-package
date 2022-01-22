import sortScripts from 'sort-scripts';

import { Transformations } from '../../types';

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
  exports(key, prevValue) {
    return [key, prevValue];
  },
};

export default transformations;
