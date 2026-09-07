/**
 * Hansprint CLI Logger
 *
 * Central logging utility for all CLI commands.
 */

const RESET = "\x1b[0m";

const COLORS = {
  blue: "\x1b[34m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
  gray: "\x1b[90m"
};

function print(color, label, message) {
  console.log(`${color}${label}${RESET} ${message}`);
}

export const logger = {
  info(message) {
    print(COLORS.blue, "ℹ", message);
  },

  success(message) {
    print(COLORS.green, "✔", message);
  },

  warn(message) {
    print(COLORS.yellow, "⚠", message);
  },

  error(message) {
    print(COLORS.red, "✖", message);
  },

  step(message) {
    print(COLORS.cyan, "➜", message);
  },

  debug(message) {
    print(COLORS.gray, "•", message);
  },

  line() {
    console.log("────────────────────────────────────────────");
  },

  blank() {
    console.log("");
  }
};

export default logger;