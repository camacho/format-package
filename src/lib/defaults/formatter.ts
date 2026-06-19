import path from 'path';

import type { Formatter } from '../../types.ts';

const formatter: Formatter = async (obj, filePath) => {
  const content = JSON.stringify(obj, null, 2);

  // Try to use prettier if it can be imported,
  // otherwise add a new line at the end
  let prettierMod;
  try {
    prettierMod = await import('prettier');
  } catch {
    return `${content}\n`;
  }

  // prettier@2 is CJS; under ESM the callable API lands on .default
  const prettier = prettierMod.default ?? prettierMod;

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
