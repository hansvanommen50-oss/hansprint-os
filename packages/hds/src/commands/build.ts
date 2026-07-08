import type { Command } from "../types/command.js";

export const buildCommand: Command = {
  name: "build",
  description: "Build workspace",

  run() {
    console.log("BUILD");
  }
};