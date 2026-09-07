import { createTheme } from "@hansprint/theme";
import { ThemeProvider } from "@hansprint/theme/runtime";
import type { Theme } from "@hansprint/theme";

export class AppShell {
  private mounted = false;

  mount(container: HTMLElement, theme?: Theme) {
    if (this.mounted) return;

    const toUse = theme ?? createTheme();
    ThemeProvider.mount(toUse);

    if (container) {
      container.setAttribute("data-hds-app", "true");
    }

    this.mounted = true;
  }

  get mountedState() {
    return this.mounted;
  }
}

export default AppShell;
