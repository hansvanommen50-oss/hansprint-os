import path from "node:path";
import { promises as fs } from "node:fs";
import {
  collectImports,
  extractPackageSpecifier,
  isSourceCodeFile,
  loadWorkspacePackages,
  walkFiles
} from "./_utils.mjs";

const packages = await loadWorkspacePackages();
const packageNames = new Set(packages.map((pkg) => pkg.name).filter(Boolean));
const edges = new Set();

for (const pkg of packages) {
  const srcDir = path.join(pkg.dir, "src");
  const files = await walkFiles(srcDir, isSourceCodeFile);

  for (const filePath of files) {
    const sourceCode = await fs.readFile(filePath, "utf8");
    const imports = collectImports(sourceCode);

    for (const value of imports) {
      const dep = extractPackageSpecifier(value);
      if (dep !== pkg.name && packageNames.has(dep)) {
        edges.add(`${pkg.name} --> ${dep}`);
      }
    }
  }
}

const lines = ["graph TD", ...[...edges].sort()];
console.log(lines.join("\n"));
