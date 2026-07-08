import { readFileSync } from "node:fs";
import { resolve } from "node:path";

function templateRoot(): string {
  return resolve(
    process.cwd(),
    "packages",
    "hds",
    "templates"
  );
}

export function loadTemplate(name: string): string {
  const file = resolve(
    templateRoot(),
    name
  );

  return readFileSync(file, "utf8");
}