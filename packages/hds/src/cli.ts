import { newCommand } from "./commands/new.js";
import { buildCommand } from "./commands/build.js";
import { doctorCommand } from "./commands/doctor.js";
import { releaseCommand } from "./commands/release.js";

export function cli() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes("--help")) {
    console.log(`
Hansprint Developer CLI

Usage:
  hds new
  hds build
  hds doctor
  hds release
`);
    return;
  }

  switch (args[0]) {
    case "new":
      newCommand.run(args.slice(1));
      break;

    case "build":
      buildCommand.run(args.slice(1));
      break;

    case "doctor":
      doctorCommand.run(args.slice(1));
      break;

    case "release":
      releaseCommand.run(args.slice(1));
      break;

    default:
      console.error(`Unknown command: ${args[0]}`);
      process.exit(1);
  }
}