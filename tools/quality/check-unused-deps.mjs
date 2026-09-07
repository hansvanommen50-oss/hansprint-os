import path from "node:path";
import { promises as fs } from "node:fs";
import {
  collectImports,
  extractPackageSpecifier,
  isSourceCodeFile,
  loadWorkspacePackages,
  printFailures,
  relativeToRoot,
  walkFiles
} from "./_utils.mjs";

const packages = await loadWorkspacePackages();
const failures = [];

for (const pkg of packages) {
  const dependencies = Object.keys(pkg.packageJson.dependencies ?? {});
  if (dependencies.length === 0) {
    continue;
  }

  const srcDir = path.join(pkg.dir, "src");
  const files = await walkFiles(srcDir, isSourceCodeFile);
  const importedSpecifiers = new Set();

  for (const filePath of files) {
    const sourceCode = await fs.readFile(filePath, "utf8");
    const imports = collectImports(sourceCode);
    for (const value of imports) {
      importedSpecifiers.add(extractPackageSpecifier(value));
    }
  }

  for (const dep of dependencies) {
    if (!importedSpecifiers.has(dep)) {
      failures.push(`${relativeToRoot(pkg.packageJsonPath)} declares unused dependency ${dep}`);
    }
  }
}

if (failures.length > 0) {
  printFailures("Unused dependency declarations:", failures.sort());
  process.exit(1);
}

console.log("unused-deps: ok");
