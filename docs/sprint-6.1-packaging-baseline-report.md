# Sprint 6.1 Packaging Baseline Report

## Scope

Sprint 6.1 established a repository-wide packaging baseline with consistent package structure, CI quality checks, canonical verification, and public API boundary enforcement.

## Package Audit

### Normalized package roots under packages

- `packages/accessibility`
- `packages/animations`
- `packages/button`
- `packages/card`
- `packages/core`
- `packages/hds`
- `packages/hero`
- `packages/icons`
- `packages/motion`
- `packages/navigation`
- `packages/theme`
- `packages/tokens`
- `packages/typography`

Each package now has:
- `package.json` with `main`/`types`/`exports` pointed to `dist`
- `tsconfig.json` with `rootDir=src` and `outDir=dist`
- `src/index.ts`

### Normalized package roots under packages/ui

- `packages/ui/alert`
- `packages/ui/badge`
- `packages/ui/button`
- `packages/ui/card`
- `packages/ui/container`
- `packages/ui/flex`
- `packages/ui/grid`
- `packages/ui/heading`
- `packages/ui/hero`
- `packages/ui/inline`
- `packages/ui/input`
- `packages/ui/modal`
- `packages/ui/section`
- `packages/ui/stack`
- `packages/ui/testcomponent`
- `packages/ui/text`

All UI packages now have package manifests, tsconfigs, and source entrypoints. CSS-importing packages have local css module declaration files in `src/global.ts`.

## Dependency Graph

Generated from source imports with `pnpm quality:graph`:

```mermaid
graph TD
  A[@hansprint/hds] --> B[@hansprint/theme]
  B[@hansprint/theme] --> C[@hansprint/tokens]
```

Raw output:
- `graph TD`
- `@hansprint/hds --> @hansprint/theme`
- `@hansprint/theme --> @hansprint/tokens`

## CI and Quality Gates

### Canonical gate

- Root script `pnpm verify` is now the canonical quality gate.
- It runs:
  - source pollution check
  - public API check
  - circular dependency check
  - unused dependency check
  - build
  - typecheck
  - lint
  - tests

### CI checks

- Added `.github/workflows/ci.yml` to run `pnpm verify` on push and pull requests.
- Updated `.github/workflows/release.yml` to run `pnpm verify` as release validation.

### Public API enforcement

- Added `tools/quality/check-public-api.mjs`.
- Rule: package imports must use package entrypoints or explicitly exported subpaths.
- Internal imports from another package's `src` and `dist` paths are rejected.

## Verification Report

Verification executed successfully via task runner:

1. `pnpm verify`
- source-pollution: ok
- public-api: ok
- circular-deps: ok
- unused-deps: ok
- recursive build: success across workspace packages/apps
- recursive typecheck: success
- lint: success with warnings only
- tests: success (4 files, 25 tests passed)

2. `pnpm quality:graph`
- succeeded and emitted the graph listed above.

## Remaining Architectural Risks

1. Workspace still contains broad parallel package surfaces (`packages/*` and `packages/ui/*`) that may overlap in responsibility. Governance for canonical package ownership is still needed.
2. Lint currently reports warnings from generated coverage artifacts; this is non-blocking but noisy.
3. Several new placeholder packages are baseline-complete but functionally minimal; API maturity and package deprecation/retention decisions should be made explicitly.
4. Public API checker currently validates workspace package boundaries from source imports only; cross-app and tooling imports are not part of this check by design.

## Documentation Added

- `CONTRIBUTING.md` now includes package layout conventions, output rules, public API boundaries, CI expectations, and local verification workflow.
