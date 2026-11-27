// Checks a commit message against the CLAUDE.md rules. Run by the `commit-msg` git hook
// (.githooks/commit-msg), which `pnpm install` switches on, so it covers commits from Claude and
// from a terminal alike.
//
//   node scripts/commit-message.mjs <message file>
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const TYPES = ['feat', 'fix', 'refactor', 'chore', 'docs', 'perf', 'ci', 'test', 'style', 'build'];
const SUBJECT = new RegExp(`^(${TYPES.join('|')})\\([a-z0-9][a-z0-9_/-]*\\)!?: \\S`);
const MAX_SUBJECT_LENGTH = 72;

// Git writes these itself; they are not ours to reword.
const GENERATED_SUBJECT = /^(Merge |Revert "|fixup! |squash! |amend! )/;
const AI_ATTRIBUTION = /^co-authored-by:|generated with|🤖|noreply@anthropic\.com/im;

/** What is wrong with `message`, as sentences; empty when it is fine. */
export function commitMessageProblems(message) {
  const lines = message.split(/\r?\n/).filter((line) => !line.startsWith('#'));
  const subject = (lines.find((line) => line.trim() !== '') ?? '').trimEnd();
  const problems = [];

  if (AI_ATTRIBUTION.test(lines.join('\n'))) {
    problems.push(
      'Remove the Co-Authored-By / "Generated with" line: commits carry no AI attribution.',
    );
  }
  if (GENERATED_SUBJECT.test(subject)) return problems;

  if (!SUBJECT.test(subject)) {
    problems.push(
      `Subject must read "type(scope): subject", e.g. "feat(plans): copy a week" (types: ${TYPES.join(', ')}).`,
    );
  }
  if (subject.length > MAX_SUBJECT_LENGTH) {
    problems.push(
      `Subject is ${subject.length} characters; keep it to ${MAX_SUBJECT_LENGTH} or fewer.`,
    );
  }
  if (subject.endsWith('.')) problems.push('Subject must not end with a period.');
  return problems;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const file = process.argv[2];
  if (!file) {
    console.error('usage: node scripts/commit-message.mjs <message file>');
    process.exit(2);
  }
  const problems = commitMessageProblems(readFileSync(file, 'utf8'));
  if (problems.length > 0) {
    console.error(
      `Commit message rejected:\n${problems.map((problem) => `  - ${problem}`).join('\n')}`,
    );
    process.exit(1);
  }
}
