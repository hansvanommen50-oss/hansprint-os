import type { Command } from "../types/command.js";

export const doctorCommand: Command = {
  name: "doctor",
  description: "Check workspace",

  run() {
    console.log("DOCTOR");
  }
};