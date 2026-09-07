import path from "node:path";
import {
  ROOT,
  printFailures,
  relativeToRoot,
  walkFiles
} from "./_utils.mjs";

const pollutionMatchers = [
  /\/src\/.*\.js$/,
  /\/src\/.*\.d\.ts$/,
  /\/src\/.*\.js\.map$/,
  /\/src\/.*\.d\.ts\.map$/
];

const searchRoots = [
  path.join(ROOT, "packages"),
  path.join(ROOT, "apps")
];

const offenders = [];

for (const root of searchRoots) {
  const files = await walkFiles(root, () => true);
  for (const filePath of files) {
    const normalized = filePath.split(path.sep).join("/");
    if (pollutionMatchers.some((matcher) => matcher.test(normalized))) {
      offenders.push(relativeToRoot(filePath));
    }
  }
}

if (offenders.length > 0) {
  printFailures("Source pollution detected:", offenders.sort());
  process.exit(1);
}

console.log("source-pollution: ok");
