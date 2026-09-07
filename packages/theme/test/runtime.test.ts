import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  cssVarManager,
  ThemeProvider,
  ThemeContext,
  __resetRuntimeForTests
} from "../src/runtime";

describe("CssVarManager", () => {
  beforeEach(() => {
    __resetRuntimeForTests();
    document.documentElement.style.cssText = "";
  });

  it("mount/update/unmount supports namespace and switching", () => {
    cssVarManager.mount({ colors: { primary: "#111111", accent: "#aaaaaa" } } as any, "one");
    cssVarManager.mount({ colors: { secondary: "#333333" } } as any, "two");

    expect(document.documentElement.style.getPropertyValue("--hds-colors-primary")).toBe("#111111");
    expect(document.documentElement.style.getPropertyValue("--hds-colors-secondary")).toBe("#333333");

    cssVarManager.update({ colors: { primary: "#222222" } } as any, "one");
    expect(document.documentElement.style.getPropertyValue("--hds-colors-primary")).toBe("#222222");
    expect(document.documentElement.style.getPropertyValue("--hds-colors-accent")).toBe("");

    cssVarManager.unmount("one");
    expect(document.documentElement.style.getPropertyValue("--hds-colors-primary")).toBe("");
    expect(document.documentElement.style.getPropertyValue("--hds-colors-secondary")).toBe("#333333");

    cssVarManager.unmount("two");
    expect(document.documentElement.style.getPropertyValue("--hds-colors-secondary")).toBe("");
  });

  it("prevents duplicate registration overwrite across namespaces", () => {
    cssVarManager.mount({ colors: { primary: "#010101" } } as any, "a");
    cssVarManager.mount({ colors: { primary: "#020202" } } as any, "b");

    expect(document.documentElement.style.getPropertyValue("--hds-colors-primary")).toBe("#010101");
  });

  it("uses explicit namespace priority: earlier mount wins", () => {
    cssVarManager.mount({ colors: { primary: "#111111" } } as any, "alpha");
    cssVarManager.mount({ colors: { primary: "#222222" } } as any, "beta");

    expect(document.documentElement.style.getPropertyValue("--hds-colors-primary")).toBe("#111111");
  });

  it("falls back to next namespace when higher-priority namespace unmounts", () => {
    cssVarManager.mount({ colors: { primary: "#111111" } } as any, "alpha");
    cssVarManager.mount({ colors: { primary: "#222222" } } as any, "beta");

    cssVarManager.unmount("alpha");

    expect(document.documentElement.style.getPropertyValue("--hds-colors-primary")).toBe("#222222");
  });

  it("assigns new priority when a namespace is re-mounted", () => {
    cssVarManager.mount({ colors: { primary: "#111111" } } as any, "alpha");
    cssVarManager.mount({ colors: { primary: "#222222" } } as any, "beta");

    cssVarManager.unmount("alpha");
    cssVarManager.mount({ colors: { primary: "#333333" } } as any, "alpha");

    // beta keeps higher priority because alpha was re-mounted later
    expect(document.documentElement.style.getPropertyValue("--hds-colors-primary")).toBe("#222222");
  });

  it("mount on existing namespace uses update diffing", () => {
    cssVarManager.mount({ colors: { primary: "#111111" } } as any, "same");
    cssVarManager.mount({ colors: { primary: "#222222" } } as any, "same");

    expect(document.documentElement.style.getPropertyValue("--hds-colors-primary")).toBe("#222222");
  });

  it("keeps shared variable during update when another namespace still claims it", () => {
    cssVarManager.mount({ colors: { primary: "#111111", accent: "#aaaaaa" } } as any, "a");
    cssVarManager.mount({ colors: { primary: "#111111" } } as any, "b");

    cssVarManager.update({ colors: { accent: "#bbbbbb" } } as any, "a");

    // primary must remain because namespace b still claims it
    expect(document.documentElement.style.getPropertyValue("--hds-colors-primary")).toBe("#111111");
    expect(document.documentElement.style.getPropertyValue("--hds-colors-accent")).toBe("#bbbbbb");
  });

  it("keeps shared variable during unmount when another namespace owns it", () => {
    cssVarManager.mount({ colors: { primary: "#111111" } } as any, "a");
    cssVarManager.mount({ colors: { primary: "#111111" } } as any, "b");

    cssVarManager.unmount("a");

    expect(document.documentElement.style.getPropertyValue("--hds-colors-primary")).toBe("#111111");

    cssVarManager.unmount("b");
    expect(document.documentElement.style.getPropertyValue("--hds-colors-primary")).toBe("");
  });

  it("handles unmount of missing namespace and reset memory cleanup", () => {
    cssVarManager.unmount("missing");
    cssVarManager.mount({ colors: { primary: "#121212" } } as any, "cleanup");
    expect(document.documentElement.style.getPropertyValue("--hds-colors-primary")).toBe("#121212");

    __resetRuntimeForTests();
    expect(document.documentElement.style.getPropertyValue("--hds-colors-primary")).toBe("");
  });

  it("early-returns without document", () => {
    const originalDocument = globalThis.document;
    Object.defineProperty(globalThis, "document", {
      value: undefined,
      configurable: true
    });

    expect(() => {
      cssVarManager.mount({ colors: { primary: "#000" } } as any, "no-dom");
      cssVarManager.update({ colors: { primary: "#111" } } as any, "no-dom");
      cssVarManager.unmount("no-dom");
    }).not.toThrow();

    Object.defineProperty(globalThis, "document", {
      value: originalDocument,
      configurable: true
    });
  });

  it("ignores unsupported primitive values and handles update on missing namespace", () => {
    cssVarManager.mount({ flags: { enabled: true } } as any, "bool-mount");
    expect(document.documentElement.style.getPropertyValue("--hds-flags-enabled")).toBe("");

    cssVarManager.update({ flags: { enabled: false } } as any, "missing-namespace");
    expect(document.documentElement.style.getPropertyValue("--hds-flags-enabled")).toBe("");
  });
});

describe("ThemeProvider and ThemeContext", () => {
  beforeEach(() => {
    __resetRuntimeForTests();
    document.documentElement.style.cssText = "";
  });

  it("mounts theme, switches theme, and exposes current via context", () => {
    const light = { mode: "light", colors: { primary: "#ffffff" } } as any;
    const dark = { mode: "dark", colors: { primary: "#000000" } } as any;

    ThemeProvider.mount(light);
    expect(ThemeProvider.getTheme()).toEqual(light);
    expect(ThemeContext.get()).toEqual(light);
    expect(document.documentElement.style.getPropertyValue("--hds-colors-primary")).toBe("#ffffff");

    ThemeProvider.mount(dark);
    expect(ThemeProvider.getTheme()).toEqual(dark);
    expect(document.documentElement.style.getPropertyValue("--hds-colors-primary")).toBe("#000000");
  });

  it("deduplicates duplicate listener registration and supports unsubscribe", () => {
    const listener = vi.fn();

    const unsubA = ThemeProvider.subscribe(listener);
    const unsubB = ThemeProvider.subscribe(listener);

    ThemeProvider.mount({ colors: { primary: "#abc" } } as any);
    expect(listener).toHaveBeenCalledTimes(1);

    unsubA();
    unsubB();
    ThemeProvider.mount({ colors: { primary: "#def" } } as any);
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("supports ThemeContext.subscribe", () => {
    const listener = vi.fn();
    const unsubscribe = ThemeContext.subscribe(listener);

    ThemeProvider.mount({ colors: { primary: "#123456" } } as any);
    expect(listener).toHaveBeenCalledTimes(1);

    unsubscribe();
  });
});
