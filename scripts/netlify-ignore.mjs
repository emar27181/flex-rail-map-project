#!/usr/bin/env node
/**
 * Netlify official ignore command. Exit 0 = skip, exit 1 = build.
 * No credentials, network calls, or third-party dependencies.
 */
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const PREVIEW_MARKER = '[netlify-preview]';

/** Known non-deploy paths only. In Memorio, brain/*.md IS deployed content. */
export const NON_DEPLOY_PATHS = Object.freeze({
  files: new Set(['README.md', 'CONTRIBUTING.md', 'CHANGELOG.md', 'LICENSE', 'CLAUDE.md', 'ARCHITECTURE.md', 'DESIGN.md']),
  directories: ['docs/', '.github/', 'tests/'],
});

export function isNonDeployPath(file) {
  return NON_DEPLOY_PATHS.files.has(file)
    || NON_DEPLOY_PATHS.directories.some(prefix => file.startsWith(prefix));
}

export function shouldBuild({ context, message = '', changedFiles = null }) {
  if (context === 'deploy-preview') return message.toLowerCase().includes(PREVIEW_MARKER);
  if (context === 'branch-deploy') return false;
  if (context === 'production') {
    // An absent or empty diff is unreliable; never silently skip production.
    if (!Array.isArray(changedFiles) || changedFiles.length === 0) return true;
    return changedFiles.some(file => !isNonDeployPath(file));
  }
  return true; // Unknown/future contexts fail open.
}

function git(args) {
  return execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
}

export function evaluateNetlifyBuild(env = process.env) {
  const { CONTEXT: context, COMMIT_REF: headCommit, CACHED_COMMIT_REF: cachedCommit } = env;
  if (context === 'branch-deploy') return { build: false, reason: 'branch deployment disabled' };
  if (context === 'deploy-preview') {
    try {
      const message = git(['log', '-1', '--format=%B', headCommit || 'HEAD']);
      const build = shouldBuild({ context, message });
      return { build, reason: build ? 'explicit preview opt-in' : 'preview not requested' };
    } catch {
      return { build: true, reason: 'Git commit message unavailable; fail open' };
    }
  }
  if (context !== 'production') return { build: true, reason: 'unrecognized context; fail open' };
  if (!headCommit || !cachedCommit || headCommit === cachedCommit) {
    return { build: true, reason: 'missing or unchanged comparison reference; fail open' };
  }
  try {
    const actualHead = git(['rev-parse', 'HEAD']).trim();
    if (actualHead !== headCommit) return { build: true, reason: 'checkout SHA mismatch; fail open' };
    git(['merge-base', '--is-ancestor', cachedCommit, headCommit]);
    const changedFiles = git(['diff', '--name-only', '-z', '--no-renames', cachedCommit, headCommit])
      .split('\0').filter(Boolean);
    const build = shouldBuild({ context, changedFiles });
    return { build, reason: build ? 'deploy-affecting change or empty diff' : 'documentation/test/config-only changes' };
  } catch {
    return { build: true, reason: 'Git comparison unavailable; fail open' };
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = evaluateNetlifyBuild();
  console.log('[netlify-ignore] ' + result.reason + ': ' + (result.build ? 'build' : 'skip'));
  process.exit(result.build ? 1 : 0);
}
