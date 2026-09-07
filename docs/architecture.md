# Hansprint OS Architecture

## Layered architecture

Hansprint OS is organized as layered packages with directional dependencies:

Core
-> Tokens
-> Theme Runtime
-> AppShell
-> Applications

Layers are designed so that lower layers do not depend on higher layers.

## Dependency rules

- Core is foundational and has no dependency on Tokens, Theme Runtime, AppShell, or Applications.
- Tokens can depend on Core utilities but not on Theme Runtime, AppShell, or Applications.
- Theme Runtime can depend on Tokens and Core, but not on AppShell or Applications.
- AppShell can depend on Theme Runtime, Tokens, and Core.
- Applications can depend on all lower layers as integration points.
- No reverse imports from lower layers to higher layers.

## Theme Runtime

Theme Runtime is implemented in the theme package and provides:

- Theme creation and typed overrides.
- Token registry integration.
- Theme registry and subscription API.
- CSS variable mount, update, and unmount lifecycle.
- Deterministic namespace precedence for CSS variable resolution.

Runtime guarantees are documented in [packages/theme/README.md](../packages/theme/README.md).

## Token flow

Token flow through runtime is:

Design Tokens
-> TokenRegistry
-> createTheme
-> ThemeProvider / ThemeRegistry
-> CssVarManager
-> CSS custom properties on document root

This flow ensures tokens are transformed into runtime-resolved CSS variables.

## AppShell

AppShell lives in the hds package and is responsible for:

- Bootstrapping the runtime theme into the application root.
- Coordinating mount behavior at app startup.
- Providing a stable integration boundary for applications.

## Playground

The demo application acts as a playground and reference integration surface:

- Uses the package layers as a consumer.
- Validates runtime behavior in an application context.
- Serves as a manual verification target for design system changes.

## Design principles

- Token-driven: visual values originate from tokens.
- Layered boundaries: dependencies flow downward only.
- Deterministic runtime behavior: precedence and resolution are explicit.
- Stable API surfaces: runtime APIs remain consistent for consumers.
- Incremental evolution: optimize behavior without breaking integration boundaries.
