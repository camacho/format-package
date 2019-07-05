async function formatter(obj) {
  const content = JSON.stringify(obj, null, 2);

  let prettier;
  try {
    prettier = require('prettier');
  } catch (error) {
    return [content, '\n'].join('');
  }

  const options = (await prettier.resolveConfig(process.cwd())) || {};
  return prettier.format(content, {
    ...options,
    parser: 'json',
    printWidth: 0,
  });
}

module.exports = formatter;
