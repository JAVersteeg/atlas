// Shared by the project's Claude Code hooks (configured in .claude/settings.json).
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname } from 'node:path';

/** The JSON Claude Code writes to a hook's stdin; {} when it is missing or unreadable. */
export async function readHookInput() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}');
  } catch {
    return {};
  }
}

/**
 * The git checkout (or linked worktree) that contains `directory`, or null. A Write may target a
 * folder that does not exist yet, so this starts from the nearest one that does.
 */
export function repoRoot(directory) {
  let existing = directory;
  while (!existsSync(existing) && dirname(existing) !== existing) existing = dirname(existing);

  const result = spawnSync('git', ['rev-parse', '--show-toplevel'], {
    cwd: existing,
    encoding: 'utf8',
  });
  return result.status === 0 ? result.stdout.trim() : null;
}

/** Stops the tool call or the turn from ending; Claude Code feeds `message` back to Claude. */
export function block(message) {
  console.error(message);
  process.exit(2);
}
