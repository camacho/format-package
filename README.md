# Format Package

`package.json` files are notorious for becoming large and overwhelming. When working in teams, this can make it hard to know how to structure the file or where to find certain configurations or scripts - especially since everyone has their own preferences.

And manually going through and organizing the file seems as painful as doing formatting checks by hand in PRs.

`format-package` solves these problems by allowing the file to be sorted and formatted in a consistent and automated manner.

It is configurable to allow teams to pick the order that work best for them, and includes `transformations` that can be applied to a value in the `package.json` (such as logically [sorting scripts](https://github.com/camacho/sort-scripts)).

<!-- AUTO-GENERATED-CONTENT:START (TOC) -->
- [Requirements](#requirements)
- [Getting started](#getting-started)
  * [Install](#install)
  * [Command Line](#command-line)
  * [Module](#module)
- [Options](#options)
  * [Defaults](#defaults)
  * [`order`](#order)
  * [`transformations`](#transformations)
  * [CLI](#cli)
- [Integrating](#integrating)
<!-- AUTO-GENERATED-CONTENT:END -->

## Requirements
<!-- AUTO-GENERATED-CONTENT:START (ENGINES) -->
* **node**: >=6.9.0
* **yarn**: >=0.27.0
<!-- AUTO-GENERATED-CONTENT:END -->

## Getting started

### Install
<!-- AUTO-GENERATED-CONTENT:START (INSTALL:flags=["--save-dev"]) -->
```sh
npm install --save-dev format-package
```
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

The module exports a default `format` function that takes the contents of `package.json` and a [map of options](#options).

It returns an ordered array with a few additional helper functions - `toJSON` and `toObject`.

<!-- AUTO-GENERATED-CONTENT:START (PRETTIER) -->
```js
const format = require('format-package');
const pkg = require('<path-to-package.json>');
const options = {};

const formattedPkg = format(pkg, options);
```
<!-- AUTO-GENERATED-CONTENT:END -->

From there, it is easy to write the new formatted package back to `package.json`:

<!-- AUTO-GENERATED-CONTENT:START (PRETTIER) -->
```js
const fs = require('fs');

fs.writeFile('<path-to-package.json>', formattedPkg.toJSON(), err => {
  if (err) throw err;
});
```
<!-- AUTO-GENERATED-CONTENT:END -->

It is possible to switch back and forth between an Array and keyed object:

<!-- AUTO-GENERATED-CONTENT:START (PRETTIER) -->
```js
const format = require('format-package');
const pkg = require('<path-to-package.json>');

const formattedPkg = format(pkg);
const formattedObj = formattedPkg.toObject();
const formattedArray = formattedObj.toArray();

console.log(formattedPkg); // [['name', 'format-package'], ['version', '1.0.0']]
console.log(formattedObj); // { name: 'format-package', version: '1.0.0' }
console.log(formattedArray); // [['name', 'format-package'], ['version', '1.0.0']]
```
<!-- AUTO-GENERATED-CONTENT:END -->

## Options

There are two options: **order** and **transformations**.

Options are expected to be passed in as a map:

```js
const format = require('format-package');
const pkg = require('<path-to-package.json>');
const options = { order: [], transformations: {} };
console.log(format(pkg, options).toJSON())
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

console.log(format(pkg, { order }).toJSON())
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

const formattedPkg = format(pkg, options);
console.log(formattedPkg.map(([k]) => k));
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

`transformations` is a map of `package.json` keys to functions that return a value to be written to `package.json`.

The default transformations map has a `scripts` method that sorts the scripts in a sensical way using ['sort-scripts'](https://github.com/camacho/sort-scripts).

<!-- AUTO-GENERATED-CONTENT:START (CODE:src=./lib/defaults/transformations.js) -->
<!-- The below code snippet is automatically added from ./lib/defaults/transformations.js -->
```js
const sortScripts = require('sort-scripts');

const transformations = {
  scripts(key, value) {
    return sortScripts(value).reduce((obj, [name, script]) => {
      obj[name] = script;
      return obj;
    }, {});
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
      return Object.keys(value).sort().reverse().reduce((obj, k) => {
        obj[k] = value[k];
        return obj;
      }, {});
    },
  },
};

const formattedPkg = format(pkg, options);
```
<!-- AUTO-GENERATED-CONTENT:END *-->

### CLI

| **Option** | **Description** | **Default** |
| -----------| --------------- | ----------- |
| `-p` | Starting path to look up the directory tree for the nearest `package.json` file to be formatted. Relative paths are resolved relative to the process `cwd` | `process.cwd()` |
| `-c` | Path to a custom configuration to use. This configuration can be JavaScript, `JSON`, or any other format that your configuration of node can `require`. The default configuration can be found [here](lib/defaults/index.js). | |
| `-w` | Write the output to the location of the found `package.json` | **false** |
| `-q` | Only print on errors | **false** |
| `-h` | Print help menu | |


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
    "package.json": [
      "format-package -w -q",
      "git add"
    ]
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
* ['husky'](https://github.com/typicode/husky) for githook integrations
* ['format-package'](https://github.com/camacho/format-package) to format `package.json`

Together, these modules ensure the `package.json` file is automatically formatted if it changes and provides an easy [npm script](https://docs.npmjs.com/misc/scripts) for manual use:

```sh
yarn format:pkg
```
