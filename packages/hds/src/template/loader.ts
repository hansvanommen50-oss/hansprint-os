import { readFileSync } from "node:fs";

export function loadTemplate(
  file: string
): string {

  return readFileSync(
    file,
    "utf8"
  );
}