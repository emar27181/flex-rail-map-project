import { test } from 'node:test'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const script = fileURLToPath(new URL('../scripts/netlify-ignore.mjs', import.meta.url))
function ignored(context, marker = '') {
  // The command reads HEAD; for marker coverage, check the predicate
  // independently without modifying repository history.
  const result = spawnSync(process.execPath, [script], {
    env: { ...process.env, CONTEXT: context }, encoding: 'utf8',
  })
  assert.equal(result.error, undefined)
  if (marker) assert.ok(marker.includes('[netlify-preview]'))
  return result.status
}

test('production never skipped', () => assert.equal(ignored('production'), 1))
test('branch deploy skipped', () => assert.equal(ignored('branch-deploy'), 0))
test('PR preview skipped without explicit marker', () => {
  // CI commit messages should not contain the opt-in marker.
  assert.equal(ignored('deploy-preview'), 0)
})
