import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { isNonDeployPath, shouldBuild, PREVIEW_MARKER } from '../scripts/netlify-ignore.mjs';

const script = fileURLToPath(new URL('../scripts/netlify-ignore.mjs', import.meta.url));

function repository() {
  const dir = mkdtempSync(join(tmpdir(), 'netlify-ignore-'));
  const git = (...args) => execFileSync('git', args, { cwd: dir, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  git('init', '-q');
  git('config', 'user.name', 'Netlify test');
  git('config', 'user.email', 'netlify-test@example.invalid');
  const commit = (path, content, message) => {
    mkdirSync(join(dir, path, '..'), { recursive: true });
    writeFileSync(join(dir, path), content);
    git('add', path);
    git('commit', '-qm', message);
    return git('rev-parse', 'HEAD');
  };
  const run = (context, head, cached) => {
    const result = spawnSync(process.execPath, [script], {
      cwd: dir,
      env: { ...process.env, CONTEXT: context, COMMIT_REF: head, CACHED_COMMIT_REF: cached },
      encoding: 'utf8',
    });
    assert.equal(result.error, undefined);
    assert.match(result.stdout, /\[netlify-ignore\]/);
    return result.status;
  };
  return { dir, commit, run };
}

test('only explicitly known non-deploy files are ignored', () => {
  for (const file of ['README.md', 'docs/seo.md', '.github/workflows/ci.yml', 'tests/unit/seo.test.ts', 'ARCHITECTURE.md']) {
    assert.equal(isNonDeployPath(file), true, file);
  }
  for (const file of ['netlify.toml', 'package.json', 'src/App.tsx', 'public/robots.txt', 'brain/tennis.md', 'netlify/functions/api.ts', 'scripts/build-index.mjs']) {
    assert.equal(isNonDeployPath(file), false, file);
  }
});

test('context policy fails open if changed files are unknown', () => {
  assert.equal(shouldBuild({ context: 'production', changedFiles: null }), true);
  assert.equal(shouldBuild({ context: 'production', changedFiles: [] }), true);
  assert.equal(shouldBuild({ context: 'production', changedFiles: ['docs/change.md', 'README.md'] }), false);
  assert.equal(shouldBuild({ context: 'production', changedFiles: ['docs/change.md', 'src/App.tsx'] }), true);
  assert.equal(shouldBuild({ context: 'deploy-preview', message: 'request ' + PREVIEW_MARKER }), true);
  assert.equal(shouldBuild({ context: 'deploy-preview', message: 'regular commit' }), false);
  assert.equal(shouldBuild({ context: 'branch-deploy' }), false);
  assert.equal(shouldBuild({ context: undefined }), true);
});

test('Git history: docs-only skips, but next source change deploys all pending changes', (t) => {
  const r = repository();
  t.after(() => rmSync(r.dir, { recursive: true, force: true }));
  const initial = r.commit('src/app.ts', 'export const app = 1;', 'first');
  const doc = r.commit('docs/guide.md', 'documentation', 'docs only');
  assert.equal(r.run('production', doc, initial), 0);
  assert.equal(r.run('production', doc, doc), 1);
  assert.equal(r.run('production', doc, 'unknown-sha'), 1);
  assert.equal(r.run('production', doc, ''), 1);
  const changed = r.commit('src/app.ts', 'export const app = 2;', 'feature');
  assert.equal(r.run('production', changed, initial), 1);
  assert.equal(r.run('production', changed, doc), 1);
});

test('Git history: preview requires marker in the latest commit', (t) => {
  const r = repository();
  t.after(() => rmSync(r.dir, { recursive: true, force: true }));
  const initial = r.commit('src/app.ts', 'a', 'ordinary change');
  assert.equal(r.run('deploy-preview', initial, initial), 0);
  const marked = r.commit('README.md', 'docs', 'preview requested ' + PREVIEW_MARKER);
  assert.equal(r.run('deploy-preview', marked, initial), 1);
  assert.equal(r.run('branch-deploy', marked, initial), 0);
  assert.equal(r.run('unrecognized', marked, initial), 1);
  const later = r.commit('docs/x.md', 'x', 'a newer change without marker');
  assert.equal(r.run('deploy-preview', later, initial), 0);
});
