// `pnpm check`: everything that must pass before work counts as done. CI (checks.yml), the Claude
// Code Stop hook and anyone at a terminal all run this one command, so "what must pass" is defined
// once. The steps run side by side and every failure is reported, not just the first.
import { spawn } from 'node:child_process';

const STEPS = [
  { name: 'typecheck', script: 'typecheck' },
  { name: 'lint', script: 'lint' },
  { name: 'test', script: 'test' },
  { name: 'format', script: 'format:check' },
];

function run({ name, script }) {
  return new Promise((resolve) => {
    const started = Date.now();
    const child = spawn('pnpm', ['run', '--silent', script], { shell: true });
    let output = '';
    child.stdout.on('data', (chunk) => (output += chunk));
    child.stderr.on('data', (chunk) => (output += chunk));
    child.on('close', (code) => {
      resolve({
        name,
        script,
        code,
        output: output.trim(),
        seconds: (Date.now() - started) / 1000,
      });
    });
  });
}

const results = await Promise.all(STEPS.map(run));

for (const { name, code, seconds } of results) {
  console.log(`${code === 0 ? 'ok  ' : 'FAIL'} ${name} (${seconds.toFixed(0)} s)`);
}

const failed = results.filter((result) => result.code !== 0);
for (const { name, script, output } of failed) {
  console.log(`\n--- ${name} (pnpm ${script}) ---\n${output}`);
}

if (failed.length > 0) {
  console.log(
    `\n${failed.length} of ${results.length} checks failed.` +
      (failed.some((result) => result.name === 'format')
        ? ' `pnpm format` fixes the formatting.'
        : ''),
  );
  process.exit(1);
}
