import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const TEMPLATE_ROOT = resolve(
  process.cwd(),
  "packages",
  "hds",
  "templates"
);

export function loadTemplate(templateName: string): string {
  return readFileSync(
    resolve(TEMPLATE_ROOT, templateName),
    "utf8"
  );
}