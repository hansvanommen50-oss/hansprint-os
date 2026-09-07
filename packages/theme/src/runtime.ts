import type { Theme } from "./index";

export type ThemeListener = (theme: Theme) => void;

function flattenToVars(
  input: Record<string, unknown>,
  prefix = "",
  output: Map<string, string> = new Map()
): Map<string, string> {
  for (const [key, value] of Object.entries(input)) {
    const path = prefix ? `${prefix}-${key}` : key;

    if (
      value !== null &&
      typeof value === "object" &&
      !Array.isArray(value)
    ) {
      flattenToVars(value as Record<string, unknown>, path, output);
      continue;
    }

    if (typeof value === "string" || typeof value === "number") {
      output.set(`--hds-${path}`, String(value));
    }
  }

  return output;
}

class CssVarManager {
  // track namespace -> flattened css vars for that namespace
  private namespaces: Map<string, Map<string, string>> = new Map();

  // explicit namespace priority (lower number wins)
  private namespacePriority: Map<string, number> = new Map();
  private nextPriority = 0;

  // resolved css vars currently applied to document root
  private resolvedVars: Map<string, string> = new Map();

  private getOrderedNamespaces(): string[] {
    return [...this.namespacePriority.entries()]
      .sort((a, b) => a[1] - b[1])
      .map(([namespace]) => namespace)
      .filter((namespace) => this.namespaces.has(namespace));
  }

  private resolveValue(name: string): string | undefined {
    for (const namespace of this.getOrderedNamespaces()) {
      const vars = this.namespaces.get(namespace);
      if (!vars) continue;
      const value = vars.get(name);
      if (value !== undefined) {
        return value;
      }
    }
    return undefined;
  }

  private applyDiff(changedNames: Set<string>) {
    const root = document.documentElement;

    for (const name of changedNames) {
      const next = this.resolveValue(name);
      const prev = this.resolvedVars.get(name);

      if (next === undefined) {
        if (prev !== undefined) {
          root.style.removeProperty(name);
          this.resolvedVars.delete(name);
        }
        continue;
      }

      if (prev !== next) {
        root.style.setProperty(name, next);
        this.resolvedVars.set(name, next);
      }
    }
  }

  mount(theme: Theme, namespace = "default") {
    if (typeof document === "undefined") return;

    if (this.namespaces.has(namespace)) {
      this.update(theme, namespace);
      return;
    }

    const nextVars = flattenToVars(theme as Record<string, unknown>);
    this.namespacePriority.set(namespace, this.nextPriority);
    this.nextPriority += 1;
    this.namespaces.set(namespace, nextVars);
    this.applyDiff(new Set(nextVars.keys()));
  }

  update(theme: Theme, namespace = "default") {
    if (typeof document === "undefined") return;

    const prev = this.namespaces.get(namespace) ?? new Map<string, string>();
    const next = flattenToVars(theme as Record<string, unknown>);

    this.namespaces.set(namespace, next);

    const changed = new Set<string>([
      ...prev.keys(),
      ...next.keys()
    ]);

    this.applyDiff(changed);
  }

  unmount(namespace = "default") {
    if (typeof document === "undefined") return;

    const prev = this.namespaces.get(namespace);
    if (!prev) return;

    this.namespaces.delete(namespace);
    this.namespacePriority.delete(namespace);
    this.applyDiff(new Set(prev.keys()));
  }

  reset() {
    if (typeof document !== "undefined") {
      const root = document.documentElement;
      for (const name of this.resolvedVars.keys()) {
        root.style.removeProperty(name);
      }
    }
    this.namespaces.clear();
    this.namespacePriority.clear();
    this.nextPriority = 0;
    this.resolvedVars.clear();
  }
}

export const cssVarManager = new CssVarManager();

class ThemeRegistryClass {
  private current?: Theme;
  private listeners: Set<ThemeListener> = new Set();

  register(theme: Theme) {
    const exists = this.current !== undefined;
    this.current = theme;

    if (exists) {
      cssVarManager.update(theme);
    } else {
      cssVarManager.mount(theme);
    }

    this.listeners.forEach((l) => l(theme));
  }

  get() {
    return this.current;
  }

  subscribe(fn: ThemeListener) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  reset() {
    this.current = undefined;
    this.listeners.clear();
  }
}

export const ThemeRegistry = new ThemeRegistryClass();

export class ThemeProvider {
  static mount(theme: Theme) {
    ThemeRegistry.register(theme);
  }

  static getTheme() {
    return ThemeRegistry.get();
  }

  static subscribe(listener: ThemeListener) {
    return ThemeRegistry.subscribe(listener);
  }
}

export const ThemeContext = {
  get: () => ThemeRegistry.get(),
  subscribe: (fn: ThemeListener) => ThemeRegistry.subscribe(fn)
};

export function __resetRuntimeForTests() {
  cssVarManager.reset();
  ThemeRegistry.reset();
}
