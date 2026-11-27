// Stop hook: before Claude ends a turn that changed app code, format the changed files and run
// `pnpm check`, plus `pnpm check:functions` when an Edge Function changed. When one fails, the turn
// does not end: the failures go back to Claude to fix.
//
// It stays quiet when nothing relevant changed, or when the exact same tree already passed (the
// result is cached in .claude/.cache/). It also stands down on a second failure in a row
// (`stop_hook_active`), so a check Claude cannot fix never traps the session.
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { block, readHookInput, repoRoot } from './lib.mjs';

const input = await readHookInput();
if (input.stop_hook_active) process.exit(0);

const root = repoRoot(input.cwd ?? process.cwd());
// A fresh worktree has no node_modules: there is nothing to check with yet.
if (!root || !existsSync(join(root, 'node_modules'))) process.exit(0);

// What `pnpm check` looks at.
const WATCHED = [
  'src',
  'App.tsx',
  'index.ts',
  'scripts',
  'eslint-rules',
  'eslint.config.mjs',
  'vitest.config.mts',
  'tailwind.config.ts',
  'tsconfig.json',
  'package.json',
  'pnpm-lock.yaml',
];
const FORMATTED =
  /^(src\/|scripts\/|eslint-rules\/)|^(App\.tsx|index\.ts|eslint\.config\.mjs|vitest\.config\.mts|tailwind\.config\.ts)$/;
const FORMATTABLE_EXTENSION = /\.(ts|tsx|mjs|mts)$/;

function changedFiles() {
  const status = spawnSync('git', ['status', '--porcelain', '-uall', '--', ...WATCHED], {
    cwd: root,
    encoding: 'utf8',
  });
  return status.stdout
    .split('\n')
    .filter(Boolean)
    .map((line) => line.slice(3).split(' -> ').pop().replace(/^"|"$/g, ''));
}

function fingerprint(files) {
  const hash = createHash('sha1');
  for (const file of [...files].sort()) {
    const full = join(root, file);
    const stat = existsSync(full) ? statSync(full) : null;
    hash.update(`${file}:${stat ? `${stat.mtimeMs}:${stat.size}` : 'gone'}\n`);
  }
  return hash.digest('hex');
}

const cacheDirectory = join(root, '.claude', '.cache');
const cacheFile = join(cacheDirectory, 'last-check-ok');
const alreadyPassed = (print) => existsSync(cacheFile) && readFileSync(cacheFile, 'utf8') === print;

let files = changedFiles();
if (files.length === 0 || alreadyPassed(fingerprint(files))) process.exit(0);

// Format first, so a formatting slip never costs a round trip.
const toFormat = files.filter(
  (file) =>
    FORMATTED.test(file) && FORMATTABLE_EXTENSION.test(file) && existsSync(join(root, file)),
);
const prettier = join(root, 'node_modules', 'prettier', 'bin', 'prettier.cjs');
if (existsSync(prettier)) {
  for (let i = 0; i < toFormat.length; i += 40) {
    spawnSync(
      process.execPath,
      [prettier, '--write', '--log-level', 'silent', ...toFormat.slice(i, i + 40)],
      {
        cwd: root,
      },
    );
  }
}

files = changedFiles();
const current = fingerprint(files);
if (alreadyPassed(current)) process.exit(0);

const COMMANDS = [{ name: 'pnpm check', args: ['check'] }];

let failed = null;
for (const command of COMMANDS) {
  const result = spawnSync('pnpm', ['run', '--silent', ...command.args], {
    cwd: root,
    encoding: 'utf8',
    shell: true,
    timeout: 7 * 60 * 1000,
    maxBuffer: 32 * 1024 * 1024,
  });
  if (result.status !== 0) {
    failed = { name: command.name, output: `${result.stdout ?? ''}${result.stderr ?? ''}`.trim() };
    break;
  }
}

if (!failed) {
  mkdirSync(cacheDirectory, { recursive: true });
  writeFileSync(cacheFile, current);
  process.exit(0);
}

const MAX_CHARACTERS = 12000;
const { output } = failed;
const shown = output.length > MAX_CHARACTERS ? `…\n${output.slice(-MAX_CHARACTERS)}` : output;
block(
  `\`${failed.name}\` fails, so this work is not done yet. Fix the failures below, then end the turn again.\n` +
    `Do not silence a violation with lint:suppress or an eslint-disable unless the code is deliberately an exception.\n\n${shown}`,
);
