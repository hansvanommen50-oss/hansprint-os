# Sprint 6 Repository Hardening Report

## Scope

Prepared repository hygiene for production-quality development with focus on source/build separation, package output consistency, and static dependency/audit checks.

## Before

- Generated artifacts existed in source paths (notably under `packages/tokens/src`).
- Source declaration stubs in UI packages were `.d.ts` files under `src`.
- Root `.gitignore` did not block all generated source artifacts (`src/**/*.js`, `src/**/*.d.ts`, maps).
- UI packages declared workspace dependencies that were not imported in source.
- Release workflow was not present.

## After

- `src` is source-only for checked patterns: no `src/**/*.js`, no `src/**/*.d.ts`, no `src/**/*.map` in workspace search.
- Generated tokens artifacts removed from source tree.
- UI css module stubs converted from `.d.ts` to `.ts` source files.
- `.gitignore` hardened for generated build artifacts and source pollution.
- Unused dependencies removed from UI package manifests.
- HDS package output metadata normalized (`main`, `types`, `files`, exports retained).
- Release workflow added to enforce validation gates on tags and manual dispatch.
- Generated snapshot artifact `tree.txt` removed.

## Export Verification

- Checked package exports to ensure dist-based entrypoints.
- Checked for invalid `src`/`lib` export paths.
- Result: no `exports.import` or `exports.types` pointing at `src`/`lib` paths in package manifests.

## Repository Audit

### Duplicate code

- CSS declaration module is duplicated in three UI packages (`global.ts`), functionally identical.
- Recommendation: move to a shared ambient declaration strategy (single include path) to remove repetition.

### Duplicate tokens

- Token values are centralized in `packages/tokens/src`.
- Separate packages such as `packages/typography`, `packages/motion`, and `packages/icons` represent parallel domains and can drift from tokens if both are treated as canonical.
- Recommendation: define one canonical token source and convert parallel packages into facades or deprecate them.

### Circular dependencies

- Static workspace import scan across `packages/**/src/**/*.ts` found directional edges:
  - `@hansprint/theme -> @hansprint/tokens`
  - `@hansprint/hds -> @hansprint/theme`
- No reverse edges found in source imports.
- Result: no cycle detected in scanned workspace package imports.

### Unused dependencies

- Removed clearly unused dependencies from UI manifests (`@hansprint/core`, `@hansprint/tokens`) where no source imports exist.
- Remaining dependency hygiene should be re-checked with package-manager tooling once terminal output is reliable.

## Validation Status

- Language/diagnostics check: no VS Code problems reported for workspace.
- Terminal command output for `pnpm build`, `pnpm typecheck`, `pnpm lint`, and `pnpm test` is currently unreliable in this session (output truncates to `pn`), so full CLI verification could not be conclusively captured in-tool.

## Files Updated In This Sprint 6 Pass

- `.gitignore`
- `.github/workflows/release.yml`
- `packages/hds/package.json`
- `packages/ui/button/package.json`
- `packages/ui/card/package.json`
- `packages/ui/container/package.json`
- `packages/ui/grid/package.json`
- `packages/ui/heading/package.json`
- `packages/ui/hero/package.json`
- `packages/ui/input/package.json`
- `packages/ui/section/package.json`
- `packages/ui/stack/package.json`
- `packages/ui/text/package.json`
- `packages/ui/button/src/global.ts` (new)
- `packages/ui/card/src/global.ts` (new)
- `packages/ui/input/src/global.ts` (new)
- Removed generated files under `packages/tokens/src` (`.js`, `.d.ts`, `.map`)
- Removed: `packages/ui/button/src/global.d.ts`, `packages/ui/card/src/global.d.ts`, `packages/ui/input/src/global.d.ts`
- Removed: `tree.txt`

## Remaining Risks

- Terminal output instability prevented authoritative in-session confirmation of CLI gate runs.
- Existing dirty workspace includes broad prior changes outside Sprint 6 scope; this increases integration and review risk.
- Several package directories still exist without normalized package manifests (for example in `packages/` and `packages/ui/`), and should be formally normalized or excluded by policy.

## Recommended Next Milestone

- Milestone: "Sprint 6.1 Packaging Baseline"
  1. Normalize all package directories (either complete package scaffolds or explicit exclusion).
  2. Enforce dependency and cycle checks in CI (dependency-cruiser/madge + unused dep checks).
  3. Add pre-commit/pre-push guard running source-pollution checks (`src/**/*.js`, `src/**/*.d.ts`, maps).
  4. Re-run and capture full `pnpm build/typecheck/lint/test` logs once terminal issue is resolved.
