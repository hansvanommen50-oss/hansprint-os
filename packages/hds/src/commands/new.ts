import type { Command } from "../types/command.js";

export const newCommand: Command = {
  name: "new",
  description: "Create a new resource",

  run(args) {
    console.log("NEW", args);
  }
};