import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

export function writeTextFile(
  file: string,
  contents: string
): void {

  mkdirSync(dirname(file), {
    recursive: true
  });

  writeFileSync(file, contents, "utf8");
}