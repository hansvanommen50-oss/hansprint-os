#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const component = process.argv[2];

if (!component) {
  console.error("Gebruik:");
  console.error("pnpm new:component Button");
  process.exit(1);
}

const kebab = component
  .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
  .toLowerCase();

const root = process.cwd();
const target = path.join(root, "packages", "ui", kebab);

if (fs.existsSync(target)) {
  console.error(`Component '${component}' bestaat al.`);
  process.exit(1);
}

fs.mkdirSync(path.join(target, "src"), { recursive: true });

console.log(`✓ Map aangemaakt: ${target}`);