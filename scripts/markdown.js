#!/usr/bin/env node

/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');

const markdownMagic = require('markdown-magic');
const SCRIPTS = require('markdown-magic-package-scripts');
const DEPENDENCYTABLE = require('markdown-magic-dependency-table');
const PRETTIER = require('markdown-magic-prettier');
const ENGINES = require('markdown-magic-engines');
const INSTALL = require('markdown-magic-install-command');

const root = path.resolve(__dirname, '..');
const globs = [`${root}/**/**.md`, `!${root}/node_modules/**`];

// Add any configurations here
const config = {
  transforms: {
    SCRIPTS,
    DEPENDENCYTABLE,
    PRETTIER,
    ENGINES,
    INSTALL,
  },
};

const target = process.argv[2] || globs;

markdownMagic(target, config);
