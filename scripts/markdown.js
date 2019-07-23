#!/usr/bin/env node

/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const execa = require('execa');

const markdownMagic = require('markdown-magic');
const SCRIPTS = require('markdown-magic-package-scripts');
const PRETTIER = require('markdown-magic-prettier');
const ENGINES = require('markdown-magic-engines');
const INSTALL = require('markdown-magic-install-command');

const { JSONPROP, REGION } = require('./markdown-transformers');

const root = path.resolve(__dirname, '..');
const globs = [`${root}/**/**.md`, `!${root}/node_modules/**`];

// Add any configurations here
const config = {
  transforms: {
    SCRIPTS,
    PRETTIER,
    ENGINES,
    INSTALL,
    REGION,
    JSONPROP,
  },
};

const target = process.argv[2] || globs;

function stageChanges(err, output) {
  if (err) throw err;

  const files = output.map(data => data.outputFilePath).filter(file => !!file);

  if (!files.length) return;

  execa.sync('yarn', ['format:docs']);
  execa.sync('git', ['add', ...files]);
}

markdownMagic(target, config, stageChanges);
