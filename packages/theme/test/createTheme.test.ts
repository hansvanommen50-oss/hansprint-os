import { describe, it, expect } from "vitest";
import {
  createTheme,
  createThemeFromTokens,
  theme,
  TokenRegistry
} from "../src/index";
import { theme as tokenTheme } from "@hansprint/tokens";

describe("createTheme", () => {
  it("returns defaults when called without overrides", () => {
    const created = createTheme();
    expect(created.colors?.primary).toBe(theme.colors?.primary);
    expect(created.typography?.fontFamily).toBe(theme.typography?.fontFamily);
    expect(created.motion?.normal).toBe(theme.motion?.normal);
  });

  it("merges overrides into defaults", () => {
    const created = createTheme({
      mode: "dark",
      colors: { primary: "#000000" },
      typography: { fontFamily: "Fira Sans" },
      motion: { normal: "120ms" }
    });

    expect(created.mode).toBe("dark");
    expect(created.colors?.primary).toBe("#000000");
    expect(created.colors?.secondary).toBe(theme.colors?.secondary);
    expect(created.typography?.fontFamily).toBe("Fira Sans");
    expect(created.motion?.normal).toBe("120ms");
  });

  it("uses TokenRegistry values as base theme", () => {
    const previous = TokenRegistry.get();

    TokenRegistry.register({
      ...tokenTheme,
      colors: {
        ...tokenTheme.colors,
        primary: "#123456"
      }
    });

    const created = createTheme();
    expect(created.colors.primary).toBe("#123456");

    TokenRegistry.register(previous);
  });

  it("createThemeFromTokens bridges to createTheme output", () => {
    const created = createThemeFromTokens({
      colors: { primary: "#abcdef" }
    });

    expect(created.colors.primary).toBe("#abcdef");
  });
});

describe("TokenRegistry", () => {
  it("registers, reads, subscribes, and resets", () => {
    const previous = TokenRegistry.get();
    let called = 0;

    const unsubscribe = TokenRegistry.subscribe(() => {
      called += 1;
    });

    TokenRegistry.register({
      ...tokenTheme,
      colors: {
        ...tokenTheme.colors,
        primary: "#010203"
      }
    });

    expect(TokenRegistry.get().colors.primary).toBe("#010203");
    expect(called).toBe(1);

    unsubscribe();
    TokenRegistry.reset();
    expect(TokenRegistry.get().colors.primary).toBe(tokenTheme.colors.primary);

    TokenRegistry.register(previous);
  });
});
