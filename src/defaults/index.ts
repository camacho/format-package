import order from './order';
import transformations from './transformations';
import formatter from './formatter';

const orderCopy = [...order];
const transformationsCopy = { ...transformations };

export {
  formatter,
  orderCopy as order,
  transformationsCopy as transformations,
};
