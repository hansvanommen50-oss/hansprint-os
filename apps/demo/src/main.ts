import "../../../packages/tokens/src/css/tokens.css";
import { createTheme, ThemeProvider } from "@hansprint/theme";
import AppShell from "@hansprint/hds/app-shell";
import { Button } from "@hansprint/ui-button";
import { Card } from "@hansprint/ui-card";
import { Container } from "@hansprint/ui-container";
import { Grid } from "@hansprint/ui-grid";
import { Heading } from "@hansprint/ui-heading";
import { Hero } from "@hansprint/ui-hero";
import { Input } from "@hansprint/ui-input";
import { Stack } from "@hansprint/ui-stack";

const app = document.querySelector("#app");

if (!app) throw new Error("App container not found");

app.innerHTML = "";

const shell = new AppShell();

// Define two simple themes for light and dark
const light = createTheme({
  mode: "light",
  colors: {
    surface: "#FFFFFF",
    text: "#111827",
    border: "#E5E7EB",
    primary: "#1F4FFF",
    secondary: "#6B7280",
    accent: "#FF6B00",
    textMuted: "#6B7280"
  },
  typography: { fontFamily: { sans: "Inter, system-ui, sans-serif" } }
});

const dark = createTheme({
  mode: "dark",
  colors: {
    surface: "#0B1220",
    text: "#F9FAFB",
    border: "#374151",
    primary: "#60A5FA",
    secondary: "#9CA3AF",
    accent: "#FB923C",
    textMuted: "#D1D5DB"
  },
  typography: { fontFamily: { sans: "Inter, system-ui, sans-serif" } }
});

// Mount AppShell and register default theme
shell.mount(app as HTMLElement, light);

// Build playground
const container = new Container({ fluid: false }).render();

const header = new Hero({ title: "Hansprint Playground", subtitle: "Theme runtime demo" }).render();

const controls = document.createElement("div");
const themeBtn = new Button({ label: "Toggle theme" }).render();
controls.appendChild(themeBtn);

const layout = new Stack().render();

const demoRow = new Grid({ columns: 2 }).render();

const left = document.createElement("div");
const right = document.createElement("div");

left.appendChild(new Heading({ level: 2, text: "Controls" }).render());
left.appendChild(controls);

const card = new Card({ title: "Card", content: "This is a card." }).render();
right.appendChild(card);
right.appendChild(new Input({ placeholder: "Email", label: "Email" }).render());

demoRow.appendChild(left);
demoRow.appendChild(right);

layout.appendChild(demoRow);

container.appendChild(header);
container.appendChild(layout);

app.appendChild(container);

let current = "light";
themeBtn.addEventListener("click", () => {
  current = current === "light" ? "dark" : "light";
  const theme = current === "light" ? light : dark;
  ThemeProvider.mount(theme);
});
