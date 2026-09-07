/**
 * Hansprint CLI
 * Doctor Command
 */

import process from "node:process";
import { execCapture } from "../utils/exec.mjs";
import CLI from "../utils/config.mjs";
import logger from "../utils/logger.mjs";

function majorVersion(version) {
  return Number.parseInt(version.replace(/^v/, "").split(".")[0], 10);
}

export async function checkNodeVersion() {
  const current = majorVersion(process.version);
  const minimum = majorVersion(CLI.minimumNode);

  if (current < minimum) {
    throw new Error(`Node.js ${CLI.minimumNode}+ required (found ${process.version}).`);
  }

  return process.version;
}

export async function checkPackageManager() {
  const version = await execCapture("pnpm", ["--version"]);
  return version;
}

export async function checkGit() {
  return execCapture("git", ["--version"]);
}

async function runCheck(label, check) {
  try {
    const result = await check();
    logger.success(`${label}: ${result}`);
    return true;
  } catch (error) {
    logger.error(`${label}: ${error.message}`);
    return false;
  }
}

export const doctorCommand = {
  name: "doctor",
  description: "Check the local development environment",

  async run() {
    logger.step("Checking development environment");
    const checks = await Promise.all([
      runCheck("Node.js", checkNodeVersion),
      runCheck("pnpm", checkPackageManager),
      runCheck("Git", checkGit)
    ]);

    if (checks.every(Boolean)) {
      logger.success("Environment is ready.");
      return;
    }

    throw new Error("Environment checks failed.");
  }
};

export default doctorCommand;
