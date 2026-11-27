// Run by `pnpm install` (the `prepare` script): points git at the committed hooks in .githooks/.
// A no-op where there is no git checkout (an EAS build, a tarball), and it never fails the install.
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';

if (existsSync('.git')) {
  try {
    execFileSync('git', ['config', 'core.hooksPath', '.githooks'], { stdio: 'ignore' });
  } catch {
    // git is missing or the config is locked: the hook is a convenience, not a requirement.
  }
}
