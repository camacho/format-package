# Sort Package

I'm one of those people who really likes having my `package.json` in a particular order. I think the consistency also helps teams, but I don't like doing these types of tasks manually, and would rather have them automated and in code so teams can configure them to their needs.

So, this is my attempt to provide a consistent ordering utility that is sensical and configurable.

<!-- AUTO-GENERATED-CONTENT:START (TOC) -->
- [Requirements](#requirements)
- [Install](#install)
- [Getting started](#getting-started)
  * [As a module](#as-a-module)
  * [As a command line tool](#as-a-command-line-tool)
- [Options](#options)
  * [Transformations](#transformations)
  * [Order](#order)
  * [CLI](#cli)
- [Using in a project](#using-in-a-project)
<!-- AUTO-GENERATED-CONTENT:END -->

## Requirements
<!-- AUTO-GENERATED-CONTENT:START (ENGINES) -->
* **node**: ^8.4.0
* **yarn**: >=0.27.5
<!-- AUTO-GENERATED-CONTENT:END -->

## Install
<!-- AUTO-GENERATED-CONTENT:START (INSTALL:flags=["--save-dev"]) -->
```sh
npm install --save-dev sort-package
```
<!-- AUTO-GENERATED-CONTENT:END -->

## Getting started

### As a module

The module exports a default `sort` function that takes an object, options, and returns an ordered array:

<!-- AUTO-GENERATED-CONTENT:START (PRETTIER) -->
```js
const sortPkg = require('sort-package');
const pkg = require('<path-to-package.json>');
const options = {};

const newPkg = sortPkg(pkg, options);
```
<!-- AUTO-GENERATED-CONTENT:END -->

From there, it is easy to write the new sorted package back to `package.json`:

<!-- AUTO-GENERATED-CONTENT:START (PRETTIER) -->
```js
const fs = require('fs');

fs.writeFile('<path-to-package.json>', newPkg.toJSON(), err => {
  if (err) throw err;
});
```
<!-- AUTO-GENERATED-CONTENT:END -->

It is possible to switch back and forth between an Array and keyed object:

<!-- AUTO-GENERATED-CONTENT:START (PRETTIER) -->
```js
const sortPkg = require('sort-package');
const pkg = require('<path-to-package.json>');

const newPkg = sortPkg(pkg);
const pkgObj = newPkg.toObject();
const pkgArray = pkgObj.toArray();

console.log(newPkg); // [['name', 'package-sort'], ['version', '1.0.0']]
console.log(pkgObj); // { name: 'package-sort', version: '1.0.0' }
console.log(pkgArray); // [['name', 'package-sort'], ['version', '1.0.0']]
```
<!-- AUTO-GENERATED-CONTENT:END -->

### As a command line tool

It is most useful to use this module as part of a `package.json` script:

```json
{
  "scripts": {
    "format:pkg": "sort-package -w"
  },
  "devDependencies": {
    "sort-package": "latest"
  }
}
```

## Options

There are only two options for the module: **Order** and **transformers**

### Transformations

Transformations is a map of `package.json` keys to functions that return the value to be stored.

The default transformations order `scripts` in a sensical way, and sort dependencies by name.

<!-- AUTO-GENERATED-CONTENT:START (CODE:src=./lib/defaults/transformations.js) -->
<!-- The below code snippet is automatically added from ./lib/defaults/transformations.js -->
```js
const sortScripts = require('sort-scripts');
const { sort: sortObj } = require('../utils/object');

const transformations = {
  scripts(key, value) {
    return sortScripts(value)
      .reduce((obj, [name, script]) => {
        obj[name] = script;
        return obj;
      }, {});
  },
  dependencies(key, value) {
    return sortObj(value);
  },
  devDependencies(key, value) {
    return sortObj(value)
  },
  peerDependencies(key, value) {
    return sortObj(value)
  },
  optionalDependencies(key, value) {
    return sortObj(value)
  },
  engines(key, value) {
    return sortObj(value)
  }
}

module.exports = transformations;
```
<!-- AUTO-GENERATED-CONTENT:END *-->

Additional transformations or overrides can be passed in:

<!-- AUTO-GENERATED-CONTENT:START (PRETTIER) -->
```js
const sortPkg = require('sort-package');
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

const newPkg = sortPkg(pkg, options);
```
<!-- AUTO-GENERATED-CONTENT:END *-->

### Order

The most meaningful part of this utility is a defined array of keys that are used to order the file.

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
  "author",
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

**Note:** if a `'...rest'` string is not found in the provided order list, it will be appended to the bottom.


<!-- AUTO-GENERATED-CONTENT:START (PRETTIER) -->
```js
const sortPkg = require('sort-package');
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

const newPkg = sortPkg(pkg, options);
console.log(newPkg.map(([k]) => k));
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

### CLI

| **Option** | **Description** | **Default** |
| -----------| --------------- | ----------- |
| `-p` | Starting path to look up the directory tree for the nearest `package.json` file to be sorted. Relative paths are resolved relative to the process `cwd` | `process.cwd()` |
| `-c` | Path to a custom configuration to use. This configuration can be JavaScript, `JSON`, or any other format that your configuration of node can `require`. The default configuration can be found [here](lib/defaults/index.js). | |
| `-w` | Write the output to the location of the found `package.json` | **false** |
| `-q` | Only print on errors | **false** |
| `-h` | Print help menu | |

## Using in a project

In my opinion, the best setup for this tool would look something like this:

```json
{
  "scripts": {
    "format:pkg": "sort-package -w -q",
    "precommit": "lint-staged",
    "prepublish": "format:pkg"
  },
  "bin": ".bin/index.js",
  "lint-staged": {
    "package.json": [
      "sort-package -w",
      "git add"
    ]
  },
  "devDependencies": {
    "lint-staged": "latest",
    "sort-package": "latest"
  },
  "optionalDependencies": {
    "husky": "latest"
  }
}
```

It combines ['lint-staged'](https://github.com/okonet/lint-staged), ['husky'](https://github.com/typicode/husky), and ['sort-package'](https://github.com/camacho/sort-package) together to ensure the `package.json` is automatically sorted if it changes using, and provides an easy [npm script](https://docs.npmjs.com/misc/scripts).
