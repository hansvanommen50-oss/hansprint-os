# Contributing

## Package Conventions

All packages in this repository must follow a consistent baseline.

1. Layout
- `package.json`
- `tsconfig.json`
- `src/index.ts`
- optional: `README.md`, tests under `test/` or `tests/`

2. Build output policy
- Source files live only in `src/`.
- Build artifacts must emit to `dist/`.
- Do not commit generated `src/**/*.js`, `src/**/*.d.ts`, source maps, or `*.tsbuildinfo`.

3. Package manifest policy
- Use `type: "module"`.
- Export public API through `exports` and `main`/`types` pointing at `dist`.
- Keep `files` restricted to `dist`.
- Prefer workspace dependencies (`workspace:*`) only when imported by source code.

4. Public API boundaries
- Import other workspace packages through package entrypoints only.
- Deep imports are allowed only for explicitly exported subpaths.
- Importing another package's `src` or `dist` internals is not allowed.

5. Verification gate
- `pnpm verify` is the canonical quality gate.
- It includes source-pollution checks, public API checks, circular dependency checks, unused dependency checks, build, typecheck, lint, and tests.

## CI Expectations

CI runs `pnpm verify` on pull requests and branch pushes. Release workflows must also run `pnpm verify`.

## Local Workflow

1. Install dependencies:
- `pnpm install`

2. Run full gate before opening PR:
- `pnpm verify`

3. Optional graph output:
- `pnpm quality:graph`
