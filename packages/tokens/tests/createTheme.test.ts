import { createTheme } from "./createTheme";

const theme = createTheme({
  colors: {
    primary: "#E30613"
  }
});

console.assert(theme.colors.primary === "#E30613");
console.assert(theme.colors.text === "#111827");