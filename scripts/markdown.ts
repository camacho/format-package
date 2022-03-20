import path from 'path';

import execa from 'execa';
import markdownMagic from 'markdown-magic';
import SCRIPTS from 'markdown-magic-package-scripts';
import PRETTIER from 'markdown-magic-prettier';
import ENGINES from 'markdown-magic-engines';
import INSTALL from 'markdown-magic-install-command';

import { JSONPROP, REGION } from './markdown-transformers';

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

function stageChanges(
  error: Error,
  output: {
    outputFilePath: string;
  }[]
): void {
  if (error) {
    throw error;
  }

  const files = output
    .map((data) => data.outputFilePath)
    .filter((file) => !!file);

  if (!files.length) return;

  execa.sync('yarn', ['format-docs']);
  execa.sync('git', ['add', ...files]);
}

markdownMagic(target, config, stageChanges);
