import { beforeEach, describe, expect, it } from "vitest";
import { AppShell } from "../src/AppShell";
import { ThemeProvider } from "@hansprint/theme/runtime";
import { __resetRuntimeForTests } from "@hansprint/theme/runtime";

describe("AppShell runtime", () => {
  beforeEach(() => {
    __resetRuntimeForTests();
    document.documentElement.style.cssText = "";
  });

  it("mounts app shell, registers default theme, and marks container", () => {
    const container = document.createElement("div");
    const shell = new AppShell();

    shell.mount(container);

    expect(shell.mountedState).toBe(true);
    expect(container.getAttribute("data-hds-app")).toBe("true");
    expect(ThemeProvider.getTheme()).toBeTruthy();
    expect(document.documentElement.style.getPropertyValue("--hds-colors-primary")).not.toBe("");
  });

  it("prevents duplicate mount registration", () => {
    const container = document.createElement("div");
    const shell = new AppShell();
    const firstTheme = { mode: "light", colors: { primary: "#101010" } } as any;
    const secondTheme = { mode: "dark", colors: { primary: "#202020" } } as any;

    shell.mount(container, firstTheme);
    shell.mount(container, secondTheme);

    expect(ThemeProvider.getTheme()).toEqual(firstTheme);
  });
});
