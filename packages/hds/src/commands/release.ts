import type { Command } from "../types/command.js";

export const releaseCommand: Command = {
  name: "release",
  description: "Create release",

  run() {
    console.log("RELEASE");
  }
};