import path from 'path';
import { readFileSync } from 'node:fs';

import JSON5 from 'json5';

interface TransformOptions {
  src?: string;
  syntax?: string;
  region?: string;
  header?: string;
  prop?: string;
}

interface TransformArgs {
  content: unknown;
  options: TransformOptions;
  srcPath: string;
}

// stolen from markdown-magic/lib/transforms/code.js
export function REGION({ options, srcPath }: TransformArgs): string | false {
  let code: string;
  let { syntax } = options;

  if (!options.src) {
    return false;
  }

  const fileDir = path.dirname(srcPath);
  const filePath = path.join(fileDir, options.src);

  try {
    code = readFileSync(filePath, 'utf8');
  } catch (e) {
    console.log(`FILE NOT FOUND ${filePath}`);
    throw e;
  }

  if (!syntax) {
    syntax = path.extname(filePath).replace(/^./, '');
  }

  const region = (options.region ?? '').replace(/['"]/g, '');

  const pattern = new RegExp(
    `([^]*?)?/{2} region ${region}[\n]([^]*?)\n/{2} endregion`,
    'igm'
  );

  if (pattern.test(code)) {
    const match = code.match(pattern);
    code = match ? match[0].replace(pattern, '$2') : code;
  } else {
    throw new Error(`Region not found: ${region}.`);
  }

  // trim leading and trailing spaces/line breaks in code
  code = code.replace(/^\s+|\s+$/g, '');

  let header = '';
  if (options.header) {
    header = `\n${options.header}`;
  }

  return `<!-- The below code snippet is automatically added from ${options.src} -->
\`\`\`${syntax}${header}
${code}
\`\`\``;
}

export function JSONPROP({ options, srcPath }: TransformArgs): string | false {
  let { syntax } = options;

  if (!options.src) {
    return false;
  }

  const fileDir = path.dirname(srcPath);
  const filePath = path.join(fileDir, options.src);

  let raw: string;
  try {
    raw = readFileSync(filePath, 'utf8');
  } catch (e) {
    console.log(`FILE NOT FOUND ${filePath}`);
    throw e;
  }

  if (!syntax) {
    syntax = path.extname(filePath).replace(/^./, '');
  }

  const parsed = JSON5.parse(raw) as Record<string, unknown>;
  const code = (options.prop && parsed[options.prop]) || parsed;
  const stringified = JSON.stringify(code, null, 2);

  let header = '';
  if (options.header) {
    header = `\n${options.header}`;
  }

  return `<!-- The below code snippet is automatically added from ${options.src} -->
\`\`\`${syntax}${header}
${stringified}
\`\`\``;
}
