import { newCommand } from "./commands/new.js";
import { buildCommand } from "./commands/build.js";
import { doctorCommand } from "./commands/doctor.js";
import { releaseCommand } from "./commands/release.js";

export const commands = [
  newCommand,
  buildCommand,
  doctorCommand,
  releaseCommand
];