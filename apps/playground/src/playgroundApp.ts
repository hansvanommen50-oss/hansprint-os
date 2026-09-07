import { createTheme, ThemeProvider, type Theme } from "@hansprint/theme";
import AppShell from "@hansprint/hds/app-shell";
import { Button } from "@hansprint/ui-button";
import { Card } from "@hansprint/ui-card";
import { Container } from "@hansprint/ui-container";
import { Grid } from "@hansprint/ui-grid";
import { Heading } from "@hansprint/ui-heading";
import { Hero } from "@hansprint/ui-hero";
import { Input } from "@hansprint/ui-input";
import { Section } from "@hansprint/ui-section";
import { Stack } from "@hansprint/ui-stack";
import { Text } from "@hansprint/ui-text";

type PageId = "foundations" | "components" | "layout" | "theme" | "inspector";
type ThemeName = "light" | "dark";

const PAGE_QUERY_KEY = "page";
const PAGE_STORAGE_KEY = "hansprint.playground.page";

interface PageConfig {
  id: PageId;
  label: string;
}

const PAGES: PageConfig[] = [
  { id: "foundations", label: "Foundations" },
  { id: "components", label: "Components" },
  { id: "layout", label: "Layout" },
  { id: "theme", label: "Theme" },
  { id: "inspector", label: "Inspector" }
];

function isPageId(value: string | null): value is PageId {
  return PAGES.some((page) => page.id === value);
}

export class PlaygroundApp {
  private readonly shell = new AppShell();
  private readonly navButtons = new Map<PageId, HTMLButtonElement>();
  private readonly appFrame = document.createElement("div");
  private readonly pageContainer = document.createElement("div");
  private readonly pageRoot = document.createElement("main");
  private readonly pageTitle = document.createElement("p");
  private readonly menuButton = document.createElement("button");
  private readonly closeButton = document.createElement("button");
  private readonly backdrop = document.createElement("button");
  private readonly root: HTMLElement;

  private mounted = false;
  private sidebarOpen = false;
  private currentPage: PageId = "foundations";
  private currentTheme: ThemeName = "light";

  private readonly handlePopState = () => {
    const nextPage = this.getPageFromUrl() ?? this.getStoredPage() ?? "foundations";
    this.setPage(nextPage, { updateUrl: false, persist: true });
  };

  private readonly handleResize = () => {
    this.syncSidebarState();
  };

  constructor(root: HTMLElement) {
    this.root = root;
  }

  mount() {
    if (this.mounted) {
      return;
    }

    this.currentPage = this.resolveInitialPage();
    this.shell.mount(this.root, this.buildTheme(this.currentTheme));
    window.addEventListener("popstate", this.handlePopState);
    window.addEventListener("resize", this.handleResize);

    this.root.className = "pg-root";
    this.root.replaceChildren();

    this.appFrame.className = "pg-frame";

    const sidebar = this.renderSidebar();
    const toolbar = this.renderToolbar();
    this.backdrop.className = "pg-backdrop";
    this.backdrop.type = "button";
    this.backdrop.setAttribute("aria-label", "Close navigation");
    this.backdrop.addEventListener("click", () => this.closeSidebar());

    this.pageRoot.className = "pg-content";
    this.pageContainer.className = "pg-page-container";
    this.pageRoot.append(toolbar, this.pageContainer);

    this.appFrame.append(sidebar, this.pageRoot, this.backdrop);
    this.root.appendChild(this.appFrame);

    this.setPage(this.currentPage, {
      updateUrl: true,
      replaceUrl: true,
      persist: true
    });
    this.syncSidebarState();
    this.mounted = true;
  }

  private renderSidebar(): HTMLElement {
    const sidebar = document.createElement("aside");
    sidebar.className = "pg-sidebar";

    const header = document.createElement("div");
    header.className = "pg-sidebar__header";

    const title = new Heading({ level: 2, text: "Hansprint Playground" }).render();
    title.classList.add("pg-sidebar__title");

    this.closeButton.type = "button";
    this.closeButton.className = "pg-sidebar__close";
    this.closeButton.textContent = "Close";
    this.closeButton.setAttribute("aria-label", "Close navigation");
    this.closeButton.addEventListener("click", () => this.closeSidebar());

    header.append(title, this.closeButton);

    const subtitle = new Text({ content: "Production-style runtime sandbox", muted: true }).render();
    subtitle.classList.add("pg-sidebar__subtitle");

    const nav = document.createElement("nav");
    nav.className = "pg-nav";

    for (const page of PAGES) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "pg-nav__item";
      button.textContent = page.label;
      button.addEventListener("click", () => {
        this.setPage(page.id);
        this.closeSidebar();
      });

      this.navButtons.set(page.id, button);
      nav.appendChild(button);
    }

    sidebar.append(header, subtitle, nav);

    return sidebar;
  }

  private renderToolbar(): HTMLElement {
    const toolbar = document.createElement("div");
    toolbar.className = "pg-toolbar";

    this.menuButton.type = "button";
    this.menuButton.className = "pg-toolbar__menu";
    this.menuButton.textContent = "Menu";
    this.menuButton.setAttribute("aria-label", "Open navigation");
    this.menuButton.addEventListener("click", () => this.openSidebar());

    this.pageTitle.className = "pg-toolbar__title";

    toolbar.append(this.menuButton, this.pageTitle);

    return toolbar;
  }

  private setPage(
    pageId: PageId,
    options: {
      updateUrl?: boolean;
      replaceUrl?: boolean;
      persist?: boolean;
    } = {}
  ) {
    this.currentPage = pageId;
    this.renderPage();

    if (options.updateUrl !== false) {
      this.syncUrl(pageId, options.replaceUrl === true);
    }

    if (options.persist !== false) {
      this.persistPage(pageId);
    }
  }

  private renderPage() {
    const page = this.createPage(this.currentPage);
    this.pageContainer.replaceChildren(page);
    this.pageTitle.textContent = this.getPageLabel(this.currentPage);
    this.syncNavState();
  }

  private syncNavState() {
    for (const [id, button] of this.navButtons.entries()) {
      const isActive = id === this.currentPage;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-current", isActive ? "page" : "false");
    }
  }

  private getPageLabel(pageId: PageId): string {
    return PAGES.find((page) => page.id === pageId)?.label ?? "Playground";
  }

  private resolveInitialPage(): PageId {
    return this.getPageFromUrl() ?? this.getStoredPage() ?? "foundations";
  }

  private getPageFromUrl(): PageId | undefined {
    const url = new URL(window.location.href);
    const value = url.searchParams.get(PAGE_QUERY_KEY);

    if (isPageId(value)) {
      return value;
    }

    return undefined;
  }

  private syncUrl(pageId: PageId, replace = false) {
    const url = new URL(window.location.href);
    if (url.searchParams.get(PAGE_QUERY_KEY) === pageId) {
      return;
    }

    url.searchParams.set(PAGE_QUERY_KEY, pageId);
    const nextUrl = `${url.pathname}${url.search}${url.hash}`;

    if (replace) {
      window.history.replaceState({ page: pageId }, "", nextUrl);
      return;
    }

    window.history.pushState({ page: pageId }, "", nextUrl);
  }

  private persistPage(pageId: PageId) {
    try {
      window.localStorage.setItem(PAGE_STORAGE_KEY, pageId);
    } catch {
      // Ignore persistence errors in restricted environments.
    }
  }

  private getStoredPage(): PageId | undefined {
    try {
      const value = window.localStorage.getItem(PAGE_STORAGE_KEY);
      if (isPageId(value)) {
        return value;
      }
    } catch {
      // Ignore persistence errors in restricted environments.
    }

    return undefined;
  }

  private isMobileLayout(): boolean {
    if (typeof window.matchMedia === "function") {
      return window.matchMedia("(max-width: 767px)").matches;
    }

    return window.innerWidth <= 767;
  }

  private openSidebar() {
    if (!this.isMobileLayout()) {
      return;
    }

    this.sidebarOpen = true;
    this.syncSidebarState();
  }

  private closeSidebar() {
    if (!this.isMobileLayout()) {
      return;
    }

    this.sidebarOpen = false;
    this.syncSidebarState();
  }

  private syncSidebarState() {
    const isMobile = this.isMobileLayout();
    if (!isMobile) {
      this.sidebarOpen = false;
    }

    const isOpen = isMobile && this.sidebarOpen;
    this.appFrame.classList.toggle("is-mobile", isMobile);
    this.appFrame.classList.toggle("is-sidebar-open", isOpen);
    this.menuButton.setAttribute("aria-expanded", String(isOpen));
    this.closeButton.setAttribute("aria-expanded", String(isOpen));
    this.backdrop.setAttribute("aria-hidden", String(!isOpen));
  }

  private createPage(pageId: PageId): HTMLElement {
    switch (pageId) {
      case "foundations":
        return this.renderFoundationsPage();
      case "components":
        return this.renderComponentsPage();
      case "layout":
        return this.renderLayoutPage();
      case "theme":
        return this.renderThemePage();
      case "inspector":
        return this.renderInspectorPage();
      default:
        return this.renderFoundationsPage();
    }
  }

  private renderFoundationsPage(): HTMLElement {
    const wrapper = document.createElement("section");
    wrapper.className = "pg-page";

    const hero = new Hero({
      title: "Foundations",
      subtitle: "Token-driven colors, typography, spacing, and motion primitives."
    }).render();

    const summary = new Text({
      content: "All visual primitives in this application are sourced from runtime theme variables managed by ThemeProvider."
    }).render();

    const tokenGrid = new Grid({ columns: 3, gap: "16px" }).render();

    tokenGrid.appendChild(new Card({ title: "Colors", content: "Primary, secondary, accent, surface, text." }).render());
    tokenGrid.appendChild(new Card({ title: "Typography", content: "Font family and semantic heading/text scale." }).render());
    tokenGrid.appendChild(new Card({ title: "Spacing & Radius", content: "Consistent layout rhythm and corners." }).render());

    wrapper.append(hero, summary, tokenGrid);

    return wrapper;
  }

  private renderComponentsPage(): HTMLElement {
    const wrapper = document.createElement("section");
    wrapper.className = "pg-page";

    wrapper.appendChild(new Heading({ level: 2, text: "Components" }).render());
    wrapper.appendChild(new Text({ content: "Examples below reuse existing Hansprint UI packages." }).render());

    const actions = document.createElement("div");
    actions.className = "pg-inline";
    actions.append(
      new Button({ label: "Primary", variant: "primary" }).render(),
      new Button({ label: "Secondary", variant: "secondary" }).render(),
      new Button({ label: "Outline", variant: "outline" }).render()
    );

    const cardRow = new Grid({ columns: 2, gap: "16px" }).render();
    cardRow.append(
      new Card({ title: "Card", content: "Cards are imported from @hansprint/ui-card." }).render(),
      new Card({ title: "Input", content: "Inputs are imported from @hansprint/ui-input." }).render()
    );

    const inputWrap = document.createElement("div");
    inputWrap.className = "pg-inline";
    inputWrap.appendChild(new Input({ placeholder: "Search components", label: "Search components" }).render());

    wrapper.append(actions, cardRow, inputWrap);

    return wrapper;
  }

  private renderLayoutPage(): HTMLElement {
    const wrapper = document.createElement("section");
    wrapper.className = "pg-page";

    wrapper.appendChild(new Heading({ level: 2, text: "Layout" }).render());

    const container = new Container({ maxWidth: "960px" }).render();
    container.classList.add("pg-layout-sample");

    const section = new Section({ title: "Page scaffolding", tight: true }).render();
    const stack = new Stack({ gap: "12px" }).render();
    stack.append(
      new Text({ content: "Container constrains width for readability." }).render(),
      new Text({ content: "Section groups related content blocks." }).render(),
      new Text({ content: "Grid arranges adaptive columns." }).render()
    );

    section.appendChild(stack);

    const grid = new Grid({ columns: 3, gap: "12px" }).render();
    grid.append(
      new Card({ title: "Column A", content: "Navigation context" }).render(),
      new Card({ title: "Column B", content: "Main content" }).render(),
      new Card({ title: "Column C", content: "Inspector panel" }).render()
    );

    container.append(section, grid);
    wrapper.appendChild(container);

    return wrapper;
  }

  private renderThemePage(): HTMLElement {
    const wrapper = document.createElement("section");
    wrapper.className = "pg-page";

    wrapper.appendChild(new Heading({ level: 2, text: "Theme" }).render());
    wrapper.appendChild(new Text({ content: `Current mode: ${this.currentTheme}` }).render());

    const controls = document.createElement("div");
    controls.className = "pg-inline";

    const toggleButton = new Button({
      label: this.currentTheme === "light" ? "Switch to dark" : "Switch to light",
      variant: "primary"
    }).render();

    toggleButton.addEventListener("click", () => {
      this.currentTheme = this.currentTheme === "light" ? "dark" : "light";
      ThemeProvider.mount(this.buildTheme(this.currentTheme));
      this.renderPage();
    });

    controls.appendChild(toggleButton);

    const preview = new Card({
      elevated: true,
      title: "Runtime preview",
      content: "This card updates as ThemeProvider remounts the active theme."
    }).render();

    wrapper.append(controls, preview);

    return wrapper;
  }

  private renderInspectorPage(): HTMLElement {
    const wrapper = document.createElement("section");
    wrapper.className = "pg-page";

    wrapper.appendChild(new Heading({ level: 2, text: "Inspector" }).render());

    const runtimeTheme = ThemeProvider.getTheme();
    const mode = runtimeTheme?.mode ?? "unset";

    const style = getComputedStyle(document.documentElement);

    const inspectedValues: Record<string, string> = {
      mode,
      "--hds-colors-primary": style.getPropertyValue("--hds-colors-primary").trim(),
      "--hds-colors-surface": style.getPropertyValue("--hds-colors-surface").trim(),
      "--hds-colors-text": style.getPropertyValue("--hds-colors-text").trim(),
      "--hds-typography-fontFamily-sans": style
        .getPropertyValue("--hds-typography-fontFamily-sans")
        .trim()
    };

    const pre = document.createElement("pre");
    pre.className = "pg-inspector";
    pre.textContent = JSON.stringify(inspectedValues, null, 2);

    wrapper.appendChild(pre);

    return wrapper;
  }

  private buildTheme(mode: ThemeName): Theme {
    if (mode === "dark") {
      return createTheme({
        mode: "dark",
        colors: {
          primary: "#7CB8FF",
          secondary: "#A3AAB8",
          accent: "#FF955B",
          surface: "#121826",
          surfaceAlt: "#0B1220",
          border: "#2A3347",
          text: "#E6EBF5",
          textMuted: "#9AA6BE"
        },
        typography: {
          fontFamily: {
            sans: "Inter, system-ui, sans-serif"
          }
        }
      });
    }

    return createTheme({
      mode: "light",
      colors: {
        primary: "#245BFF",
        secondary: "#687489",
        accent: "#FF6B3D",
        surface: "#FFFFFF",
        surfaceAlt: "#F4F7FC",
        border: "#D8DFEA",
        text: "#162033",
        textMuted: "#5E6B81"
      },
      typography: {
        fontFamily: {
          sans: "Inter, system-ui, sans-serif"
        }
      }
    });
  }
}
