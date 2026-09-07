/**
 * Hansprint CLI
 * Help Command
 */

import CLI from "../utils/config.mjs";
import { listCommands } from "../registry.mjs";

export const helpCommand = {
  name: "help",
  description: "Show available commands",

  run() {
    console.log(`${CLI.name} v${CLI.version}`);
    console.log(CLI.description);
    console.log("");
    console.log("Usage:");
    console.log(`  ${CLI.shortName} <command> [options]`);
    console.log("");
    console.log("Commands:");

    for (const command of listCommands()) {
      console.log(`  ${command.name.padEnd(12)} ${command.description}`);
    }
  }
};

export default helpCommand;
