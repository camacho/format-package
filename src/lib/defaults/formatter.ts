import path from 'path';

import { Formatter } from '../../types';

const formatter: Formatter = async (obj, filePath) => {
  const content = JSON.stringify(obj, null, 2);

  // Try to use prettier if it can be imported,
  // otherwise add a new line at the end
  let prettier;
  try {
    prettier = require('prettier');
  } catch (error) {
    return `${content}\n`;
  }

  let config = await prettier.resolveConfig(
    filePath ? path.dirname(filePath) : process.cwd()
  );

  if (!config) {
    config = {};
  }

  return prettier.format(content, {
    ...config,
    parser: 'json',
    printWidth: 0,
  });
};

export default formatter;
