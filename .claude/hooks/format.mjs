// PostToolUse hook: run Prettier on a file Claude just edited, using the
// Prettier install of the package (client/ or server/) the file belongs to.
// Never blocks Claude: any failure exits 0 silently.
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

const EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.json', '.css', '.md']);

try {
  const input = JSON.parse(readFileSync(0, 'utf8'));
  const filePath = input?.tool_input?.file_path;
  if (!filePath || !EXTENSIONS.has(path.extname(filePath))) process.exit(0);

  const projectDir = process.env.CLAUDE_PROJECT_DIR || input.cwd || process.cwd();
  const rel = path.relative(projectDir, path.resolve(filePath)).split(path.sep);
  const pkg = rel[0];
  if (pkg !== 'client' && pkg !== 'server') process.exit(0);
  if (rel.includes('node_modules') || rel.at(-1) === 'package-lock.json') process.exit(0);

  const pkgDir = path.join(projectDir, pkg);
  const prettierBin = path.join(pkgDir, 'node_modules', 'prettier', 'bin', 'prettier.cjs');
  if (!existsSync(prettierBin)) process.exit(0);

  execFileSync(process.execPath, [prettierBin, '--write', '--log-level', 'silent', filePath], {
    cwd: pkgDir,
    stdio: 'ignore',
    timeout: 25000,
  });
} catch {
  // formatting is best-effort
}
process.exit(0);
