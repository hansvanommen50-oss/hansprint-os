import { beforeEach, describe, expect, it } from "vitest";
import { __resetRuntimeForTests } from "@hansprint/theme/runtime";
import { PlaygroundApp } from "../src/playgroundApp";

const PAGE_STORAGE_KEY = "hansprint.playground.page";

function mountPlayground() {
  const root = document.createElement("div");
  root.id = "app";
  document.body.appendChild(root);

  const app = new PlaygroundApp(root);
  app.mount();

  return root;
}

function clickNav(label: string) {
  const navButtons = [...document.querySelectorAll<HTMLButtonElement>(".pg-nav__item")];
  const button = navButtons.find((node) => node.textContent?.trim() === label);

  if (!button) {
    throw new Error(`Navigation button not found: ${label}`);
  }

  button.click();
}

describe("Playground interactions", () => {
  beforeEach(() => {
    __resetRuntimeForTests();
    document.body.innerHTML = "";
    window.localStorage.clear();
    window.history.replaceState({}, "", "/");
    document.documentElement.style.cssText = "";
  });

  it("sidebar navigation updates active page and URL", () => {
    mountPlayground();

    clickNav("Components");

    expect(window.location.search).toContain("page=components");
    expect(window.localStorage.getItem(PAGE_STORAGE_KEY)).toBe("components");
    expect(document.querySelector(".pg-nav__item.is-active")?.textContent?.trim()).toBe("Components");
    expect(document.querySelector(".pg-page-container h2")?.textContent).toBe("Components");
  });

  it("theme switch updates runtime mode and CSS variables", () => {
    mountPlayground();

    clickNav("Theme");

    const toggle = [...document.querySelectorAll<HTMLButtonElement>("button")]
      .find((button) => button.textContent?.includes("Switch to dark"));

    expect(toggle).toBeTruthy();
    toggle?.click();

    expect(document.body.textContent).toContain("Current mode: dark");

    const primary = getComputedStyle(document.documentElement)
      .getPropertyValue("--hds-colors-primary")
      .trim()
      .toLowerCase();

    expect(primary).toBe("#7cb8ff");
  });

  it("persists active page when URL is absent", () => {
    mountPlayground();
    clickNav("Layout");

    document.body.innerHTML = "";
    window.history.replaceState({}, "", "/");

    mountPlayground();

    expect(window.location.search).toContain("page=layout");
    expect(document.querySelector(".pg-page-container h2")?.textContent).toBe("Layout");
  });

  it("responds to browser navigation events", () => {
    mountPlayground();

    window.history.pushState({}, "", "?page=inspector");
    window.dispatchEvent(new PopStateEvent("popstate"));

    expect(document.querySelector(".pg-page-container h2")?.textContent).toBe("Inspector");

    window.history.pushState({}, "", "?page=foundations");
    window.dispatchEvent(new PopStateEvent("popstate"));

    expect(document.querySelector(".pg-page-container h1")?.textContent).toBe("Foundations");
  });
});
