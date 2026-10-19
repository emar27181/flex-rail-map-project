#!/usr/bin/env node
// Netlify ignore command: 0 = skip, 1 = build.
// Production is deliberately never skipped; only opt-in PR previews build.
// Use the exact marker in the latest commit message to request a preview.
import { execFileSync } from 'node:child_process'

function shouldBuild(context, message) {
  if (context === 'production') return true
  if (context === 'deploy-preview') return message.toLowerCase().includes('[netlify-preview]')
  return false // branch deploys are not needed for this site
}

let message = ''
try {
  message = execFileSync('git', ['log', '-1', '--format=%B'], { encoding: 'utf8' })
} catch {
  // Fail open on unexpected Git failures to avoid silently losing deploys.
  process.exit(1)
}
process.exit(shouldBuild(process.env.CONTEXT ?? '', message) ? 1 : 0)
