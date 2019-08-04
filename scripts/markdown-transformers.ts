/* eslint-disable import/no-extraneous-dependencies, no-console, no-useless-escape */
const path = require('path');

const fs = require('fs-extra');
const JSON5 = require('json5');

// stolen from markdown-magic/lib/transforms/code.js
function REGION(content, options, config) {
  let code;
  let { syntax } = options;
  if (!options.src) {
    return false;
  }

  const fileDir = path.dirname(config.originalPath);
  const filePath = path.join(fileDir, options.src);

  try {
    code = fs.readFileSync(filePath, 'utf8', (err, contents) => {
      if (err) {
        console.log(`FILE NOT FOUND ${filePath}`);
        console.log(err);
        // throw err
      }
      return contents;
    });
  } catch (e) {
    console.log(`FILE NOT FOUND ${filePath}`);
    throw e;
  }
  if (!syntax) {
    syntax = path.extname(filePath).replace(/^./, '');
  }

  const region = options.region.replace(/['"]/g, '');

  const pattern = new RegExp(
    `([^]*?)?\/{2} region ${region}[\n]([^]*?)\n\/{2} endregion`,
    'igm'
  );

  if (pattern.test(code)) {
    code = code.match(pattern);
    code = code[0].replace(pattern, '$2');
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

function JSONPROP(content, options, config) {
  let code;
  let { syntax } = options;
  if (!options.src) {
    return false;
  }

  const fileDir = path.dirname(config.originalPath);
  const filePath = path.join(fileDir, options.src);

  try {
    code = fs.readFileSync(filePath, 'utf8', (err, contents) => {
      if (err) {
        console.log(`FILE NOT FOUND ${filePath}`);
        console.log(err);
        // throw err
      }
      return contents;
    });
  } catch (e) {
    console.log(`FILE NOT FOUND ${filePath}`);
    throw e;
  }
  if (!syntax) {
    syntax = path.extname(filePath).replace(/^./, '');
  }

  code = JSON5.parse(code);
  code = code[`${options.prop}`] || code;
  code = JSON.stringify(code, null, 2);

  let header = '';
  if (options.header) {
    header = `\n${options.header}`;
  }

  return `<!-- The below code snippet is automatically added from ${options.src} -->
\`\`\`${syntax}${header}
${code}
\`\`\``;
}

module.exports = {
  JSONPROP,
  REGION,
};
