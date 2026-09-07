#!/usr/bin/env node

import process from "node:process";
import { showBanner } from "./utils/banner.mjs";
import CLI from "./utils/config.mjs";
import { getCommand } from "./registry.mjs";
import logger from "./utils/logger.mjs";

export async function run(argv = process.argv.slice(2)) {
  const [name, ...args] = argv;

  if (!name || name === "help" || name === "--help" || name === "-h") {
    showBanner();
    await getCommand("help").run(args);
    return 0;
  }

  if (name === "--version" || name === "-v") {
    console.log(`${CLI.name} v${CLI.version}`);
    return 0;
  }

  const command = getCommand(name);

  if (!command) {
    logger.error(`Unknown command: ${name}`);
    logger.info(`Run ${CLI.shortName} --help to list available commands.`);
    return 1;
  }

  try {
    await command.run(args);
    return 0;
  } catch (error) {
    logger.error(error.message);
    return 1;
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const exitCode = await run();
  process.exitCode = exitCode;
}
