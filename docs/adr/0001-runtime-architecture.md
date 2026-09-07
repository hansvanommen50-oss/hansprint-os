# ADR 0001: Runtime Architecture

## Status

Accepted

## Context

Hansprint OS needs a runtime architecture that is consistent across packages, deterministic in theme behavior, and maintainable as the system grows.

The project includes foundational utilities, design tokens, theme runtime behavior, shell-level app composition, and consumer applications. Without explicit layering, dependency direction and runtime behavior can drift.

## Decision

Hansprint OS uses a token-driven runtime architecture with:

Core
-> Tokens
-> Theme Runtime
-> AppShell
-> Applications

This decision establishes:

- Clear package layering and dependency direction.
- Token-first theme derivation and runtime variable resolution.
- AppShell as the application runtime integration layer.
- Applications as consumers of stable lower-layer APIs.

## Consequences

Positive:

- Predictable dependency graph and easier maintenance.
- Deterministic runtime behavior around tokens and theme resolution.
- Clear ownership boundaries between foundational, runtime, and app concerns.
- Easier onboarding due to explicit architecture flow.

Trade-offs:

- Some changes require cross-layer coordination.
- Strict dependency direction may require refactoring existing shortcuts.
- Runtime features may need phased rollout to preserve stable APIs.

## Alternatives considered

### Alternative 1: Flat package architecture

All packages can depend on each other as needed.

- Pros: quick short-term implementation.
- Cons: dependency cycles, unclear boundaries, harder long-term maintenance.

### Alternative 2: App-first architecture

Applications own runtime decisions and pull utilities ad hoc.

- Pros: local flexibility in each app.
- Cons: duplicated runtime logic and inconsistent behavior across apps.

### Alternative 3: Theme runtime directly in applications

No dedicated Theme Runtime layer; apps compose token logic themselves.

- Pros: reduced central runtime surface.
- Cons: repeated token resolution logic and weak guarantees for consistency.

The selected layered architecture best supports deterministic runtime behavior and long-term maintainability.
