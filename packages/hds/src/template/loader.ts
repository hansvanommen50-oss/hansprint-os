import { readFileSync } from "node:fs";

export function loadTemplate(path: string): string {
  return readFileSync(path, "utf8");
}