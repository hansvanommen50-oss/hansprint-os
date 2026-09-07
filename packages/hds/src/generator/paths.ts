import { resolve } from "node:path";

export function workspaceRoot(): string {
  return process.cwd();
}

export function componentRoot(name: string): string {
  return resolve(
    workspaceRoot(),
    "packages",
    "ui",
    name.toLowerCase()
  );
}