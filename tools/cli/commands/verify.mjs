/**
 * Hansprint CLI
 * Verify Command
 */

import { exec } from "../utils/exec.mjs";
import logger from "../utils/logger.mjs";

export const verifyCommand = {
  name: "verify",
  description: "Run the complete repository verification suite",

  async run(args = []) {
    if (args.length > 0) {
      throw new Error("The verify command does not accept arguments.");
    }

    logger.step("Running repository verification");
    await exec("pnpm", ["verify"]);
    logger.success("Repository verification passed.");
  }
};

export default verifyCommand;
