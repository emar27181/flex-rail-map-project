# Netlify build-minutes policy

GitHub Actions remains the source of CI verification. Netlify builds are reserved for production releases and explicitly requested previews.

| Context | Build |
| --- | --- |
| Production (`main`) | Always (including docs-only commits; fail-safe) |
| PR Deploy Preview | Only when HEAD commit message contains `[netlify-preview]` |
| Branch deploy | Skip |

The gate is `scripts/netlify-ignore.mjs`, configured through `netlify.toml`.
Netlify's ignore convention is **exit 0 = skip**, **exit 1 = build**.

## Request a preview
Add `[netlify-preview]` to the **latest commit message** of the PR, then push it. Updating the PR description or adding a GitHub label alone will not trigger it. A subsequent commit without the marker will skip its own preview; the last successful preview remains stale. To refresh it, use the marker again. Do not use Netlify build hooks as a workaround: Netlify ignores the ignore command for build-hook requests.

## Manual Netlify checks
- Project configuration → Developer settings → Continuous deployment → Branches and deploy contexts: verify Deploy Previews enabled and Branch deploys set to None.
- Keep Build status active. Stopping builds also stops production deployments.
- Verify main merges still publish once quota resets.
- Verify preview opt-in, default skip, and documentation-only behavior in Netlify deploy logs once quota resets.
- Check whether duplicate deploys originate from other integrations/build hooks before changing settings.

This gate does **not** skip production README-only builds, intentionally. Doing so safely requires additional changed-file comparison and explicit deployment-config exceptions. The current goal is preserving production safety while eliminating most PR builds.
