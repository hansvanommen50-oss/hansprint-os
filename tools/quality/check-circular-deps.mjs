import path from "node:path";
import { promises as fs } from "node:fs";
import {
  collectImports,
  extractPackageSpecifier,
  isSourceCodeFile,
  loadWorkspacePackages,
  printFailures,
  walkFiles
} from "./_utils.mjs";

const packages = await loadWorkspacePackages();
const packageNames = new Set(packages.map((pkg) => pkg.name).filter(Boolean));

const graph = new Map();
for (const pkg of packages) {
  graph.set(pkg.name, new Set());
  const srcDir = path.join(pkg.dir, "src");
  const files = await walkFiles(srcDir, isSourceCodeFile);

  for (const filePath of files) {
    const sourceCode = await fs.readFile(filePath, "utf8");
    const imports = collectImports(sourceCode);

    for (const value of imports) {
      const dep = extractPackageSpecifier(value);
      if (dep !== pkg.name && packageNames.has(dep)) {
        graph.get(pkg.name).add(dep);
      }
    }
  }
}

const visited = new Set();
const inStack = new Set();
const stack = [];
const cycles = [];

function dfs(node) {
  visited.add(node);
  inStack.add(node);
  stack.push(node);

  for (const next of graph.get(node) ?? []) {
    if (!visited.has(next)) {
      dfs(next);
      continue;
    }

    if (inStack.has(next)) {
      const start = stack.indexOf(next);
      if (start !== -1) {
        const cycle = [...stack.slice(start), next];
        const key = cycle.join("->");
        if (!cycles.includes(key)) {
          cycles.push(key);
        }
      }
    }
  }

  stack.pop();
  inStack.delete(node);
}

for (const node of graph.keys()) {
  if (!visited.has(node)) {
    dfs(node);
  }
}

if (cycles.length > 0) {
  printFailures("Circular dependencies detected:", cycles.sort());
  process.exit(1);
}

console.log("circular-deps: ok");
