import path from 'path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

import { markdownMagic } from 'markdown-magic';
import SCRIPTS from 'markdown-magic-package-scripts';
import PRETTIER from 'markdown-magic-prettier';
import ENGINES from 'markdown-magic-engines';
import INSTALL from 'markdown-magic-install-command';

import { JSONPROP, REGION } from './markdown-transformers.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const globs = [`${root}/**/**.md`, `!${root}/node_modules/**`];

// Add any configurations here
const config = {
  matchWord: 'AUTO-GENERATED-CONTENT',
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

function stageChanges(files: string[]): void {
  if (!files.length) return;

  execFileSync('npx', ['prettier', '--write', ...files]);
  execFileSync('git', ['add', ...files]);
}

const { filesChanged } = await markdownMagic(target, config);

stageChanges(filesChanged);
