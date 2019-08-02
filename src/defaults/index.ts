import * as order from './order.json';
import transformations from './transformations';
import formatter from './formatter';

const orderCopy = order.slice();
const transformationsCopy = { ...transformations };

export {
  formatter,
  orderCopy as order,
  transformationsCopy as transformations,
};
