import type { Command } from "../types/command.js";
import { generateComponent } from "../generator/index.js";

export const newCommand: Command = {
  name: "new",
  description: "Create a new component",

  run(args: string[]) {
    if (args.length < 2 || args[0] !== "component") {
      console.error("Usage: hds new component <Name>");
      return;
    }

    const result = generateComponent({
      name: args[1]
    });

    console.log(result);
  }
};