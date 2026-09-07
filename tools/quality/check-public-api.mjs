import path from "node:path";
import { promises as fs } from "node:fs";
import {
  collectImports,
  isSourceCodeFile,
  loadWorkspacePackages,
  printFailures,
  relativeToRoot,
  walkFiles
} from "./_utils.mjs";

const workspacePackages = await loadWorkspacePackages();
const workspaceNames = new Set(workspacePackages.map((item) => item.name).filter(Boolean));
const packageByName = new Map(workspacePackages.map((item) => [item.name, item]));
const failures = [];

function isExportedSubpath(pkgName, importValue) {
  const target = packageByName.get(pkgName);
  if (!target) {
    return false;
  }

  const exportsField = target.packageJson.exports;
  if (!exportsField || typeof exportsField !== "object" || Array.isArray(exportsField)) {
    return false;
  }

  const remainder = importValue.slice(pkgName.length);
  if (!remainder.startsWith("/")) {
    return false;
  }

  const subpath = `.${remainder}`;
  return Object.prototype.hasOwnProperty.call(exportsField, subpath);
}

for (const pkg of workspacePackages) {
  const exportsField = pkg.packageJson.exports;

  if (exportsField) {
    const serialized = JSON.stringify(exportsField);
    if (serialized.includes("/src/") || serialized.includes("/lib/")) {
      failures.push(`${relativeToRoot(pkg.packageJsonPath)} exports must not point to src/lib`);
    }
  }

  const srcDir = path.join(pkg.dir, "src");
  const files = await walkFiles(srcDir, isSourceCodeFile);

  for (const filePath of files) {
    const sourceCode = await fs.readFile(filePath, "utf8");
    const imports = collectImports(sourceCode);

    for (const value of imports) {
      if (value.includes("/src/") || value.includes("/dist/")) {
        failures.push(`${relativeToRoot(filePath)} imports internal path ${value}`);
      }

      if (value.startsWith("@hansprint/")) {
        const [scope, name, maybeSubpath] = value.split("/");
        const base = `${scope}/${name}`;

        if (workspaceNames.has(base) && maybeSubpath && maybeSubpath.length > 0) {
          if (!isExportedSubpath(base, value)) {
            failures.push(`${relativeToRoot(filePath)} deep-imports workspace package ${value}`);
          }
        }
      }
    }
  }
}

if (failures.length > 0) {
  printFailures("Public API boundary violations:", failures.sort());
  process.exit(1);
}

console.log("public-api: ok");
