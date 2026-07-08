import { resolve } from "node:path";

export function template(file: string): string {
  return resolve(
    process.cwd(),
    "packages",
    "hds",
    "templates",
    file
  );
}