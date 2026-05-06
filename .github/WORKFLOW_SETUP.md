# Workflow Setup Guide

This repository uses GitHub Actions for CI/CD. To ensure everything works correctly, please follow these steps.

## Required GitHub Secrets

| Secret      | Description                          | Where to get        |
|-------------|--------------------------------------|---------------------|
| `NPM_TOKEN`   | NPM automation token (read+write)    | npmjs.com → Access Tokens |

### How to set secrets:
1. Go to your GitHub repository.
2. Navigate to **Settings** > **Secrets and variables** > **Actions**.
3. Click **New repository secret**.
4. Add the secrets listed above.

## How to trigger a publish
The publish workflow is only triggered on the `main` branch when the commit message contains the `[release]` tag.

1. Make your changes in `packages/*`.
2. Commit with the release tag: 
   ```bash
   git commit -m "feat: add new feature [release]"
   ```
3. Push to `main`: 
   ```bash
   git push origin main
   ```
4. GitHub Actions will automatically:
   - Build only the changed packages.
   - Publish them to NPM under the `@alisdev` scope.
   - Create a release tag (e.g., `release/2026-05-06-1100`).

## Deployment
The documentation site is automatically deployed to GitHub Pages on every push to the `main` branch. 

**Note**: Ensure that GitHub Pages is set to **GitHub Actions** in **Settings** > **Pages** > **Build and deployment** > **Source**.

## Branch Strategy
- **`dev`**: Active development branch. CI (lint + build) runs on every push and PR.
- **`main`**: Stable production branch. Triggers publish (if `[release]` present) and docs deployment.
