# @hansprint/theme

Minimal theme package scaffold for Hansprint design language.

## Runtime Guarantees

- Runtime API stability:
	- `cssVarManager.mount(theme, namespace?)`
	- `cssVarManager.update(theme, namespace?)`
	- `cssVarManager.unmount(namespace?)`
	- `ThemeProvider.mount(theme)`
	- `ThemeProvider.getTheme()`
	- `ThemeProvider.subscribe(listener)`
- Namespace precedence is explicit and deterministic:
	- Earlier mounted namespaces have higher priority.
	- A lower-priority namespace only provides a CSS variable when all higher-priority namespaces do not define it.
	- Unmounting a namespace reveals values from the next highest-priority namespace for overlapping variables.
	- Re-mounting a namespace assigns a new (later) priority.
- Updates preserve namespace priority:
	- `update` changes values in place and does not change a namespace's precedence.
- Runtime safety:
	- No runtime filesystem access.
	- No dynamic module loading.
	- No runtime `require()`.
