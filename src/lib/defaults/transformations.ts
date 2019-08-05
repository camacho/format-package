import * as sortScripts from 'sort-scripts';
import { Transformations } from '../transform';

const transformations: Transformations = {
  scripts(key, prevValue) {
    const nextValue = sortScripts(prevValue).reduce(
      (obj, [name, value]) => ({ ...obj, [name]: value }),
      {}
    );

    return [key, nextValue];
  },
};

export { transformations as default };
