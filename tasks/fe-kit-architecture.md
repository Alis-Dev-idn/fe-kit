# Prompt: `fe-kit` — Frontend Monorepo Architecture (React + TypeScript + Vite)

## Overview

Set up a monorepo for `@alisdev/fe-kit` — a single npm package that aggregates all frontend utility kits for React + TypeScript projects. Uses **pnpm workspaces** + **Turborepo** for build pipeline and caching.

---

## Repository Info

```
GitHub: Alis-Dev-idn/fe-kit
npm:    @alisdev/fe-kit
```

---

## Monorepo Structure

```
fe-kit/
├── packages/
│   ├── axios/            # migrated from @alisdev/axios-kit repo https://github.com/Alis-Dev-idn/axios-kit.git
│   │   ├── src/
│   │   └── package.json
│   ├── form/             # new
│   │   ├── src/
│   │   └── package.json
│   ├── store/            # new
│   │   ├── src/
│   │   └── package.json
│   ├── table/            # new
│   │   ├── src/
│   │   └── package.json
│   ├── notify/           # new
│   │   ├── src/
│   │   └── package.json
│   ├── confirm/          # new
│   │   ├── src/
│   │   └── package.json
│   ├── modal/            # new
│   │   ├── src/
│   │   └── package.json
│   ├── dashboard/        # new
│   │   ├── src/
│   │   └── package.json
│   └── route/            # new
│       ├── src/
│       └── package.json
├── src/
│   └── index.ts          # aggregator — re-exports all packages
├── package.json          # root package — published as @alisdev/fe-kit
├── pnpm-workspace.yaml
├── turbo.json
├── tsconfig.base.json
└── README.md
```

---

## Root `package.json`

```json
{
  "name": "@alisdev/fe-kit",
  "version": "2.0.0",
  "description": "All-in-one frontend utility kit for React + TypeScript + Vite",
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  },
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev",
    "lint": "turbo run lint",
    "test": "turbo run test",
    "clean": "turbo run clean",
    "publish:pkg": "pnpm build && npm publish --access public"
  },
  "dependencies": {
    "axios": "^1.x",
    "zod": "^3.x"
  },
  "peerDependencies": {
    "react": "^18.x",
    "react-dom": "^18.x"
  },
  "devDependencies": {
    "typescript": "^5.x",
    "@types/react": "^18.x",
    "@types/react-dom": "^18.x",
    "@types/node": "^20.x",
    "turbo": "^2.x",
    "tsup": "^8.x"
  }
}
```

---

## `pnpm-workspace.yaml`

```yaml
packages:
  - "packages/*"
```

---

## `turbo.json`

```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "outputs": []
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": []
    },
    "clean": {
      "cache": false
    }
  }
}
```

---

## `tsconfig.base.json` (shared base config)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "jsx": "react-jsx",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}
```

---

## Per-package `tsconfig.json`

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

---

## Per-package `package.json` template

```json
{
  "name": "@alisdev/fe-kit-axios",
  "version": "2.0.0",
  "private": true,
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "scripts": {
    "build": "tsup src/index.ts --format cjs,esm --dts",
    "dev": "tsup src/index.ts --format cjs,esm --dts --watch",
    "clean": "rm -rf dist"
  }
}
```

Note: All sub-packages are `"private": true` — only root `@alisdev/fe-kit` is published to npm.

---

## Root `src/index.ts` — Aggregator

```typescript
// axios
export * from "../packages/axios/src"

// form
export * from "../packages/form/src"

// store
export * from "../packages/store/src"

// table
export * from "../packages/table/src"

// notify
export * from "../packages/notify/src"

// confirm
export * from "../packages/confirm/src"

// modal
export * from "../packages/modal/src"

// dashboard
export * from "../packages/dashboard/src"

// route
export * from "../packages/route/src"
```

---

## Build Tool: `tsup`

Root `tsup.config.ts`:
```typescript
import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  clean: true,
  sourcemap: true,
  splitting: false,
  treeshake: true,
  external: ["react", "react-dom"],
})
```

---

## Versioning Strategy

- **Lockstep versioning** — all packages share the same version
- Start at `2.0.0` (migrated from v1.x `@alisdev/axios-kit`)
- Version only defined in root `package.json`
- Sub-packages are `private: true`

---

## Migration from v1

### Deprecation notice:
```bash
npm deprecate @alisdev/axios-kit "Moved to @alisdev/fe-kit. Please upgrade."
```

### Breaking changes:

| v1 | v2 |
|---|---|
| `import { AxiosKit } from "@alisdev/axios-kit"` | `import { AxiosKit } from "@alisdev/fe-kit"` |

---

## Consumer App Usage

```bash
# Minimal install
npm install @alisdev/fe-kit axios zod react react-dom

# Full install (same — all deps are either bundled or peer)
npm install @alisdev/fe-kit axios zod
```

```typescript
// Single import for everything
import {
  // axios
  AxiosKit, ApiError, useApi,
  DownloadProgress, UploadProgress,

  // form
  useForm, useFieldArray,

  // store
  createStore, createContextStore,

  // table
  useTable, exportCsv, exportExcel,

  // notify
  NotifyKit, notify,

  // confirm
  ConfirmKit, confirm, alert, prompt, useConfirm,

  // modal
  ModalKit, Modal, useModal,

  // dashboard
  DashboardKit, Dashboard, useDashboard, SidebarItem, SidebarGroup,

  // route
  RouteKit, createRoutes, AuthRoute, RoleRoute, Breadcrumb, useBreadcrumb,
} from "@alisdev/fe-kit"
```

---

## Output Requirements

1. Set up complete monorepo with pnpm workspaces + Turborepo
2. Migrate existing code from `@alisdev/axios-kit` into `packages/axios/`
3. Create empty scaffold for new packages: `form`, `store`, `table`, `notify`, `confirm`, `modal`, `dashboard`, `route`
4. Configure `tsup` for dual CJS + ESM output with TypeScript declarations
5. Mark `react` and `react-dom` as external in tsup config — never bundle them
6. Root `src/index.ts` re-exports all packages
7. Write `README.md` with:
   - Migration guide from v1 → v2
   - Installation instructions
   - Full import example
   - Links to each kit's documentation
8. All sub-packages must be `private: true`
9. Only root package is published to npm as `@alisdev/fe-kit`
