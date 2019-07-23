# Format Package [![codecov](https://codecov.io/gh/camacho/format-package/branch/master/graph/badge.svg)](https://codecov.io/gh/camacho/format-package)

[![Greenkeeper badge](https://badges.greenkeeper.io/camacho/format-package.svg)](https://greenkeeper.io/)

<!-- AUTO-GENERATED-CONTENT:START (INSTALL:flags=["-D"]) -->

```sh
yarn add -D format-package prettier@^1.6.0
```

<!-- AUTO-GENERATED-CONTENT:END -->

<!-- AUTO-GENERATED-CONTENT:START (TOC2:collapse=true) -->
<details>
<summary>Table of Contents</summary>

- [Getting started](#getting-started)
  - [Requirements](#requirements)
  - [Command Line](#command-line)
  - [Module](#module)
- [Options](#options)
  - [Defaults](#defaults)
  - [`order`](#order)
  - [`transformations`](#transformations)
  - [`formatter`](#formatter)
  - [CLI](#cli)
- [Configuration Files](#configuration-files)
  - [Configuration Schema](#configuration-schema)
  - [Configuration Examples](#configuration-examples)
  - [with package.json](#with-packagejson)
  - [with format-package.json](#with-format-packagejson)
  - [with `format-package.js` or `format-package.config.js`](#with-format-packagejs-or-format-packageconfigjs)
  - [with format-package.{yml,yaml}, format-package.config.{yml,yaml}](#with-format-packageymlyaml-format-packageconfigymlyaml)
- [Integrating](#integrating)
- [Development](#development)
  - [Scripts](#scripts)

</details>
<!-- AUTO-GENERATED-CONTENT:END -->

## Getting started

`package.json` files are notorious for becoming large and overwhelming. When working in teams, this can make it hard to know how to structure the file or where to find certain configurations or scripts - especially since everyone has their own preferences.

And manually going through and organizing the file seems as painful as doing formatting checks by hand in PRs.

`format-package` solves these problems by allowing the file to be sorted and formatted in a consistent and automated manner.

It is configurable to allow teams to pick the order that work best for them, and includes `transformations` that can be applied to a value in the `package.json` (such as logically [sorting scripts](https://github.com/camacho/sort-scripts)).

### Requirements

<!-- AUTO-GENERATED-CONTENT:START (ENGINES) -->

- **node**: >=7.6.0
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

- **order** (_Array_)
- **transformations** (_Object_)
- **formatter** (_Function_)

Options are expected to be passed in as a keyed object:

<!-- AUTO-GENERATED-CONTENT:START (PRETTIER) -->

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

<!-- AUTO-GENERATED-CONTENT:END -->

### Defaults

The `format-package` module also exports its defaults to help with configuration:

<!-- AUTO-GENERATED-CONTENT:START (PRETTIER) -->

```js
const format = require('format-package');
const pkg = require('<path-to-package.json>');
const {
  defaults: { order: defaultOrder },
} = format;

// Move `...rest` to the bottom of the default order list
const restIndex = defaultOrder.indexOf(sort, '...rest');
let order = [...defaultOrder];
if (restIndex !== -1) order.splice(restIndex, 1);
order.push('...rest');

format(pkg, { order }).then(formattedPkg => console.log(formattedPkg));
```

<!-- AUTO-GENERATED-CONTENT:END -->

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
  "os",
  "cpu",
  "repository",
  "bugs",
  "homepage",
  "author",
  "keywords",
  "bin",
  "man",
  "main",
  "module",
  "browser",
  "files",
  "directories",
  "config",
  "publishConfig",
  "scripts",
  "husky",
  "lint-staged",
  "...rest",
  "dependencies",
  "peerDependencies",
  "devDependencies",
  "optionalDependencies",
  "bundledDependencies"
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

By default, the formatter will try to use [`prettier`](https://github.com/prettier/prettier) if it is installed, and will fallback to `JSON.stringify` if the [peer dependency](https://nodejs.org/es/blog/npm/peer-dependencies/) is not found:

<!-- AUTO-GENERATED-CONTENT:START (CODE:src=./lib/defaults/formatter.js) -->
<!-- The below code snippet is automatically added from ./lib/defaults/formatter.js -->

```js
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
```

<!-- AUTO-GENERATED-CONTENT:END *-->

### CLI

The CLI accepts a series of files or globs to be formatted, as well as a set of options.

```
yarn format-package "**/package.json"
```

Options can also be passed as environment variables and are used in the following order of precedence:

1. Command line options
2. Env vars

```
FORMAT_PACKAGE_VERBOSE=true
```

| **Option** | **Alias** | **ENV**                | **Description**                                                                                                                                                                                                               | **Default**                  |
| ---------- | --------- | ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- |
| `config`   | `c`       | FORMAT_PACKAGE_CONFIG  | Path to a custom configuration to use. This configuration can be JavaScript, `JSON`, or any other format that your configuration of node can `require`. The default configuration can be found [here](lib/defaults/index.js). |                              |
| `write`    | `w`       | FORMAT_PACKAGE_WRITE   | Write the output to the location of the found `package.json`                                                                                                                                                                  | **false**                    |
| `ignore`   | `i`       | FORMAT_PACKAGE_IGNORE  | Patterns for ignoring matching files                                                                                                                                                                                          | **`['**/node_modules/**']`** |
| `verbose`  | `v`       | FORMAT_PACKAGE_VERBOSE | Print the output of the formatting                                                                                                                                                                                            | **false**                    |
| `help`     | `h`       |                        | Print help menu                                                                                                                                                                                                               |                              |

You can also see the available options in the terminal by running:

```
yarn format-package --help
```

## Configuration Files

`format-package` will search for a valid configuration file in the following order of precedence.

1.  If the option `--config [path | module id]` or a `FORMAT_PACKAGE_CONFIG`
    environment variable is provided:

         a. check if the value resolves to a module id, else
         b. check if value resolves to an existing path

    If either `a` or `b` are valid configuration, then use the configuration, else
    return the [default](lib/defaults/index.js) configuration.

If neither a `--config` or a `FORMAT_PACKAGE_CONFIG` environment variable is provided, search for configurations in the following places:

2.  [`format-package.js`](#with-format-packagejs-or-format-packageconfigjs)
3.  [`format-package.yaml` or `format-package.yml`](#with-format-packageymlyaml-format-packageconfigymlyaml)
4.  [`format-package.json`](#with-format-packagejson)
5.  [`format-package.config.js`](#with-format-packagejs-or-format-packageconfigjs)
6.  [`format-package.config.yaml` or `format-package.config.yml`](#with-format-packageymlyaml-format-packageconfigymlyaml)
7.  [`format-package`](#with-packagejson) property in `package.json`

If there are no configuration from the above search places, `format-package` will move up one directory level and try again.

`format-package` will continue searching until arriving at the home directory.

If no configuration is found, then the [default](lib/defaults/index.js) configuration is used.

### Configuration Schema

<!-- AUTO-GENERATED-CONTENT:START (REGION:src=./lib/cli/config-schema.js&region='Joi Schema') -->
<!-- The below code snippet is automatically added from ./lib/cli/config-schema.js -->

```js
const JoiConfigSchema = Joi.object({
  order: Joi.array()
    .min(1)
    .unique()
    .optional(),
  transformations: Joi.object().optional(),
  formatter: Joi.func().optional(),
});
```

<!-- AUTO-GENERATED-CONTENT:END -->

### Configuration Examples

Supported configuration formats: JSON, JSON5, JS, and YAML.

### with package.json

<!-- AUTO-GENERATED-CONTENT:START (JSONPROP:src=./examples/format-package-property/package.json&prop=format-package) -->
<!-- The below code snippet is automatically added from ./examples/format-package-property/package.json -->

```json
{
  "order": ["name", "version"]
}
```

<!-- AUTO-GENERATED-CONTENT:END -->

### with format-package.json

<!-- AUTO-GENERATED-CONTENT:START (CODE:src=./examples/format-package-json/format-package.json) -->
<!-- The below code snippet is automatically added from ./examples/format-package-json/format-package.json -->

```json
{
  "order": ["name", "description", "..."]
}
```

<!-- AUTO-GENERATED-CONTENT:END -->

### with `format-package.js` or `format-package.config.js`

<!-- AUTO-GENERATED-CONTENT:START (CODE:src=./examples/format-package-config-js/format-package.config.js) -->
<!-- The below code snippet is automatically added from ./examples/format-package-config-js/format-package.config.js -->

```js
module.exports = {
  order: ['name', 'description', '...'],
};
```

<!-- AUTO-GENERATED-CONTENT:END -->

### with format-package.{yml,yaml}, format-package.config.{yml,yaml}

<!-- AUTO-GENERATED-CONTENT:START (CODE:src=./examples/format-package-config-yml/format-package.config.yml) -->
<!-- The below code snippet is automatically added from ./examples/format-package-config-yml/format-package.config.yml -->

```yml
order:
  - name
  - description
  - ...
```

<!-- AUTO-GENERATED-CONTENT:END -->

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

- [lint-staged](https://github.com/okonet/lint-staged) for automatically running tasks on staged files
- [husky](https://github.com/typicode/husky) for githook integrations
- [format-package](https://github.com/camacho/format-package) to format `package.json`

Together, these modules ensure the `package.json` file is automatically formatted if it changes and provides an easy [package.json script](https://docs.npmjs.com/misc/scripts) for manual use:

```sh
yarn format:pkg
```

## Development

Clone the repo and install dependencies to get started with development:

```sh
git clone git@github.com:camacho/format-package.git
yarn install
```

### Scripts

These scripts can be run via `yarn` or `npm run`:

<!-- AUTO-GENERATED-CONTENT:START (SCRIPTS) -->

| Script           | Description                                                                                                           |
| ---------------- | --------------------------------------------------------------------------------------------------------------------- |
| `docs`           | updates any auto-generated-content blocks in [Markdown](https://guides.github.com/features/mastering-markdown/) files |
| `format`         | format the application code                                                                                           |
| `format:docs`    | format application documents                                                                                          |
| `format:package` | format package.json files                                                                                             |
| `format:source`  | format source content using [prettier](https://github.com/prettier/prettier)                                          |
| `gamut`          | run the full gamut of checks - reset environment, generate docs, format and lint code, and run tests                  |
| `lint`           | lint the application code                                                                                             |
| `prepublishOnly` | make sure the package is in good state before publishing                                                              |
| `reset`          | reset the `node_modules` dependencies                                                                                 |
| `test`           | run unit tests for the application                                                                                    |

<!-- AUTO-GENERATED-CONTENT:END -->

**Note** - This repo depends on [husky](https://github.com/typicode/husky) and [lint-staged](https://github.com/okonet/lint-staged) to automatically format code and update documents. If these commands are not run, code changes will most likely fail.
