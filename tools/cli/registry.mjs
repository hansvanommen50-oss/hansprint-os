/**
 * Hansprint CLI
 * Command Registry
 */

import { doctorCommand } from "./commands/doctor.mjs";
import { helpCommand } from "./commands/help.mjs";
import { verifyCommand } from "./commands/verify.mjs";

const builtInCommands = [helpCommand, doctorCommand, verifyCommand];

function validateCommand(command) {
  if (!command || typeof command.name !== "string" || command.name.length === 0) {
    throw new TypeError("A command must have a non-empty name.");
  }

  if (typeof command.run !== "function") {
    throw new TypeError(`Command "${command.name}" must provide a run function.`);
  }

  return Object.freeze({
    description: "",
    ...command
  });
}

export function createRegistry(commands = builtInCommands) {
  const registry = new Map();

  for (const command of commands) {
    const validatedCommand = validateCommand(command);

    if (registry.has(validatedCommand.name)) {
      throw new Error(`Command already registered: ${validatedCommand.name}`);
    }

    registry.set(validatedCommand.name, validatedCommand);
  }

  return registry;
}

export const registry = createRegistry();

export function getCommand(name) {
  return registry.get(name);
}

export function listCommands() {
  return [...registry.values()];
}

export function registerCommand(command) {
  const validatedCommand = validateCommand(command);

  if (registry.has(validatedCommand.name)) {
    throw new Error(`Command already registered: ${validatedCommand.name}`);
  }

  registry.set(validatedCommand.name, validatedCommand);
  return validatedCommand;
}

export default registry;
