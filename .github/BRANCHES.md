# Branch Strategy

This repository follows a strict branching strategy to ensure stability and automated delivery.

| Branch | Purpose                        | Triggers                        |
|--------|--------------------------------|---------------------------------|
| `dev`    | Active development             | CI (lint + build) on every push |
| `main`   | Stable / production-ready      | CI + Publish (if [release] in commit) + Deploy Docs |

## Workflow

1. **Develop**: All active development should happen on the `dev` branch or feature branches branching from `dev`.
2. **Merge to dev**: When a feature is ready, merge it into `dev`. GitHub Actions will verify the build.
3. **Release**: When ready to release to production/NPM:
   - Create a Pull Request from `dev` to `main`.
   - On the merge commit to `main`, ensure the message contains `[release]`.
4. **Automation**: GitHub Actions handles the rest:
   - Publishes only changed packages to NPM.
   - Deploys the latest documentation to GitHub Pages.
   - Creates a release tag.

## Branch Protection
- **`main`**: 
  - Requires a pull request before merging.
  - Requires status checks to pass (`lint-and-build`).
- **`dev`**:
  - Requires status checks to pass (`lint-and-build`).
