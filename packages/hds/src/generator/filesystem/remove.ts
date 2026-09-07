import { rmSync } from "node:fs";

export function remove(path: string): void {
  rmSync(path, {
    recursive: true,
    force: true
  });
}