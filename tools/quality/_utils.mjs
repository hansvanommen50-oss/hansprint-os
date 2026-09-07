import { promises as fs } from "node:fs";
import path from "node:path";

export const ROOT = process.cwd();

export const PACKAGE_ROOTS = [
  path.join(ROOT, "packages"),
  path.join(ROOT, "packages", "ui")
];

export async function pathExists(targetPath) {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

export async function readJson(filePath) {
  const content = await fs.readFile(filePath, "utf8");
  return JSON.parse(content);
}

export async function listDirs(dirPath) {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);
}

export async function walkFiles(dirPath, matcher, files = []) {
  if (!(await pathExists(dirPath))) {
    return files;
  }

  const entries = await fs.readdir(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      await walkFiles(fullPath, matcher, files);
      continue;
    }

    if (matcher(fullPath)) {
      files.push(fullPath);
    }
  }

  return files;
}

export function asPosixPath(inputPath) {
  return inputPath.split(path.sep).join("/");
}

export function relativeToRoot(inputPath) {
  return asPosixPath(path.relative(ROOT, inputPath));
}

export function isSourceCodeFile(filePath) {
  return /\.(ts|tsx|js|jsx|mjs|cjs)$/.test(filePath);
}

export async function loadWorkspacePackages() {
  const packageDirs = [];

  for (const root of PACKAGE_ROOTS) {
    if (!(await pathExists(root))) {
      continue;
    }

    const dirs = await listDirs(root);
    for (const dir of dirs) {
      const fullPath = path.join(root, dir);
      const packageJsonPath = path.join(fullPath, "package.json");
      if (await pathExists(packageJsonPath)) {
        const packageJson = await readJson(packageJsonPath);
        packageDirs.push({
          name: packageJson.name,
          dir: fullPath,
          packageJsonPath,
          packageJson
        });
      }
    }
  }

  return packageDirs;
}

export function extractPackageSpecifier(rawImport) {
  if (!rawImport.startsWith("@")) {
    return rawImport.split("/")[0] ?? rawImport;
  }

  const parts = rawImport.split("/");
  if (parts.length < 2) {
    return rawImport;
  }

  return `${parts[0]}/${parts[1]}`;
}

export function collectImports(sourceCode) {
  const found = new Set();
  const importRegex = /(?:import\s+[^"'`]*from\s*["'`]([^"'`]+)["'`])|(?:import\s*\(\s*["'`]([^"'`]+)["'`]\s*\))|(?:require\(\s*["'`]([^"'`]+)["'`]\s*\))/g;

  let match = importRegex.exec(sourceCode);
  while (match) {
    const value = match[1] ?? match[2] ?? match[3];
    if (value) {
      found.add(value);
    }
    match = importRegex.exec(sourceCode);
  }

  return [...found];
}

export function printFailures(header, failures) {
  if (failures.length === 0) {
    return;
  }

  console.error(`\n${header}`);
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
}
