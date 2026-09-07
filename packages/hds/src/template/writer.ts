import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

export function writeTemplate(
  file: string,
  content: string
) {
  mkdirSync(dirname(file), {
    recursive: true
  });

  writeFileSync(file, content);
}