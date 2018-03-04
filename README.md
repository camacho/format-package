# Format Package [![codecov](https://codecov.io/gh/camacho/format-package/branch/master/graph/badge.svg)](https://codecov.io/gh/camacho/format-package)

[![Greenkeeper badge](https://badges.greenkeeper.io/camacho/format-package.svg)](https://greenkeeper.io/)

<!-- AUTO-GENERATED-CONTENT:START (INSTALL:flags=["-D"]) -->
```sh
yarn add -D format-package
```
<!-- AUTO-GENERATED-CONTENT:END -->

<!-- AUTO-GENERATED-CONTENT:START (TOC:collapse=true) -->
<details>
<summary>Table of Contents</summary>

- [Getting started](#getting-started)
  * [Requirements](#requirements)
  * [Command Line](#command-line)
  * [Module](#module)
- [Options](#options)
  * [Defaults](#defaults)
  * [`order`](#order)
  * [`transformations`](#transformations)
  * [`formatter`](#formatter)
  * [CLI](#cli)
- [Integrating](#integrating)

</details>
<!-- AUTO-GENERATED-CONTENT:END -->

## Getting started

`package.json` files are notorious for becoming large and overwhelming. When working in teams, this can make it hard to know how to structure the file or where to find certain configurations or scripts - especially since everyone has their own preferences.

And manually going through and organizing the file seems as painful as doing formatting checks by hand in PRs.

`format-package` solves these problems by allowing the file to be sorted and formatted in a consistent and automated manner.

It is configurable to allow teams to pick the order that work best for them, and includes `transformations` that can be applied to a value in the `package.json` (such as logically [sorting scripts](https://github.com/camacho/sort-scripts)).

### Requirements

<!-- AUTO-GENERATED-CONTENT:START (ENGINES) -->
* **node**: >=7.6.0
<!-- AUTO-GENERATED-CONTENT:END -->

### Command Line

This module provides a simple CLI:

```sh
./node_modules/.bin/format-package --help
```

If combined with [Yarn](https://yarnpkg.com/), it can be run as:

```sh
yarn format-package --help
```

It can also be used as part of an [npm script](https://docs.npmjs.com/misc/scripts):

```json
{
  "scripts": {
    "format:pkg": "format-package -w"
  },
  "devDependencies": {
    "format-package": "latest"
  }
}
```

```sh
yarn format:pkg
```

### Module

The module exports an _asynchronous_ `format` function that takes the contents of `package.json` and a [set of options](#options).

It returns a newly sorted and formatted `package.json` string.

<!-- AUTO-GENERATED-CONTENT:START (PRETTIER) -->
```js
#!/usr/bin/env node

const fs = require('fs');
const format = require('format-package');
const pkg = require('<path-to-package.json>');

async function formatPackage(pkg) {
  const options = {parser: 'json'}
  const formattedPkg = await format(pkg, options);

  fs.writeFile('<path-to-package.json>', formattedPkg, err => {
    if (err) throw err;
  });
}

formatPackage(pkg).catch(err => {
  console.error(err);
  process.exit(1);
});
```
<!-- AUTO-GENERATED-CONTENT:END -->

## Options

There are three options:

* **order** (_Array_)
* **transformations** (_Object_)
* **formatter** (_Function_)

Options are expected to be passed in as a keyed object:

```js
const format = require('format-package');
const pkg = require('<path-to-package.json>');
const options = {
  order: [],
  transformations: {},
  formatter: v => v.toString(),
};
format(pkg, options).then(formattedPkg => console.log(formattedPkg));
```

### Defaults

The `format-package` module also exports its defaults to help with configuration:

```js
const format = require('format-package');
const pkg = require('<path-to-package.json>');
const { { defaults: { order: defaultOrder } } = format;

// Move `...rest` to the bottom of the default order list
const restIndex = defaultOrder.indexOf(sort, '...rest');
let order = [...defaultOrder];
if (restIndex !=== -1) order.splice(restIndex, 1);
order.push('...rest');

format(pkg, { order }).then(formattedPkg => console.log(formattedPkg))
```

### `order`

The most meaningful part of this utility is an ordered array of keys that are used to order the contents of `package.json`.

The default order is:

<!-- AUTO-GENERATED-CONTENT:START (CODE:src=./lib/defaults/order.json) -->
<!-- The below code snippet is automatically added from ./lib/defaults/order.json -->
```json
[
  "name",
  "version",
  "description",
  "license",
  "private",
  "engines",
  "repository",
  "bugs",
  "homepage",
  "author",
  "bin",
  "main",
  "module",
  "browser",
  "config",
  "scripts",
  "lint-staged",
  "...rest",
  "dependencies",
  "peerDependencies",
  "devDependencies",
  "optionalDependencies"
]
```
<!-- AUTO-GENERATED-CONTENT:END *-->

The `...rest` value is considered special. It marks the location where the remaining `package.json` keys that are not found in this ordered list will be placed in alphabetical order.

**Note:** if a `...rest` string is not found in the provided order list, it will be appended to the bottom.

<!-- AUTO-GENERATED-CONTENT:START (PRETTIER) -->
```js
const format = require('format-package');
const pkg = require('<path-to-package.json>');
const options = {
  order: [
    'name',
    'version',
    'scripts',
    'jest',
    'dependencies',
    'peerDependencies',
    'devDependencies',
    'optionalDependencies',
    '...rest',
  ],
};

format(pkg, options).then(formattedPkg =>
  Object.keys(JSON.parse(formattedPkg))
);
/*
[ 'name',
'version',
'scripts',
'dependencies',
'devDependencies',
'optionalDependencies',
'author',
'bin',
'bugs',
'description',
'engines',
'homepage',
'license',
'lint-staged',
'main',
'repository' ]
*/
```
<!-- AUTO-GENERATED-CONTENT:END *-->

### `transformations`

`transformations` is a map of `package.json` keys and corresponding _synchronous_ or _asynchronous_ functions that take a **key** and **value** and return a **key** and **value** to be written to `package.json`.

The default transformations map has a `scripts` method that sorts the scripts in a sensical way using ['sort-scripts'](https://github.com/camacho/sort-scripts).

<!-- AUTO-GENERATED-CONTENT:START (CODE:src=./lib/defaults/transformations.js) -->
<!-- The below code snippet is automatically added from ./lib/defaults/transformations.js -->
```js
const sortScripts = require('sort-scripts');

const transformations = {
  scripts(key, prevValue) {
    const nextValue = sortScripts(prevValue).reduce(
      (obj, [name, value]) => Object.assign({}, obj, { [name]: value }),
      {}
    );

    return [key, nextValue];
  },
};

module.exports = transformations;
```
<!-- AUTO-GENERATED-CONTENT:END *-->

**Notes:** Any `package.json` property that is an object **and** does not have a defined transformation will be alphabetically sorted.

Additional transformations or overrides can be passed in:

<!-- AUTO-GENERATED-CONTENT:START (PRETTIER) -->
```js
const format = require('format-package');
const pkg = require('<path-to-package.json>');
const options = {
  transformations: {
    // This reverses all the keys in dependencies
    dependencies(key, value) {
      return [
        key,
        Object.keys(value)
          .sort()
          .reverse()
          .reduce((obj, k) => {
            obj[k] = value[k];
            return obj;
          }, {}),
      ];
    },
  },
};

format(pkg, options);
```
<!-- AUTO-GENERATED-CONTENT:END *-->

### `formatter`

The formatter is the function used to prepare the contents before being returned.

A custom _synchronous_ or _asynchronous_ formatter can be supplied that will process the resulting package contents.

By default, `JSON.stringify` is used:

<!-- AUTO-GENERATED-CONTENT:START (CODE:src=./lib/defaults/formatter.js) -->
<!-- The below code snippet is automatically added from ./lib/defaults/formatter.js -->
```js
function formatter(obj) {
  return [JSON.stringify(obj, null, 2), '\n'].join('');
}

module.exports = formatter;
```
<!-- AUTO-GENERATED-CONTENT:END *-->

An alternative would be to use [`prettier`](https://github.com/prettier/prettier):

<!-- AUTO-GENERATED-CONTENT:START (PRETTIER) -->
```js
const formatPkg = require('format-package');
const prettier = require('prettier');
const pkg = require('./package.json');

const formatter = async content => {
  const options = await prettier.resolveConfig('./package.json');
  return prettier.format(content, options);
};

formatPkg(pkg, { formatter });
```
<!-- AUTO-GENERATED-CONTENT:END *-->

### CLI

| **Option** | **Alias** | **Description**                                                                                                                                                                                                               | **Default** |
| ---------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| `config`   | `c`       | Path to a custom configuration to use. This configuration can be JavaScript, `JSON`, or any other format that your configuration of node can `require`. The default configuration can be found [here](lib/defaults/index.js). |             |
| `write`    | `w`       | Write the output to the location of the found `package.json`                                                                                                                                                                  | **false**   |
| `verbose`  | `v`       | Print the output of the formatting                                                                                                                                                                                            | **false**   |
| `help`     | `h`       | Print help menu                                                                                                                                                                                                               |             |

You can also see the available options in the terminal by running:

```
yarn format-package --help
```

## Integrating

An effective integration of this plugin could look like this:

```json
{
  "scripts": {
    "format:pkg": "format-package -w",
    "precommit": "lint-staged",
    "prepublish": "format:pkg"
  },
  "lint-staged": {
    "package.json": ["format-package -w", "git add"]
  },
  "devDependencies": {
    "lint-staged": "latest",
    "format-package": "latest"
  },
  "optionalDependencies": {
    "husky": "latest"
  }
}
```

This configuration combines:

* [lint-staged](https://github.com/okonet/lint-staged) for automatically running tasks on staged files
* [husky](https://github.com/typicode/husky) for githook integrations
* [format-package](https://github.com/camacho/format-package) to format `package.json`

Together, these modules ensure the `package.json` file is automatically formatted if it changes and provides an easy [package.json script](https://docs.npmjs.com/misc/scripts) for manual use:

```sh
yarn format:pkg
```
