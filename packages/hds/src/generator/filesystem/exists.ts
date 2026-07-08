import { existsSync } from "node:fs";

export function exists(path: string): boolean {
  return existsSync(path);
}