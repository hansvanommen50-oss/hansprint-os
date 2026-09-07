import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

const directories = [
  ".hansprint",
  ".hansprint/adr"
];

const files = [
  "TEAM.md",
  "CODING-STANDARDS.md",
  "ARCHITECTURE.md",
  "DEFINITION-OF-DONE.md",
  "AI-RULES.md",
  "RELEASE.md",
  "ROADMAP.md",
  "SPRINTS.md",
  "README.md"
];

for (const dir of directories) {
  const fullPath = join(root, dir);

  if (!existsSync(fullPath)) {
    mkdirSync(fullPath, { recursive: true });
    console.log(`✓ Created ${dir}`);
  }
}

for (const file of files) {
  const fullPath = join(root, ".hansprint", file);

  if (!existsSync(fullPath)) {
    writeFileSync(
      fullPath,
      `# ${file.replace(".md", "")}\n\n> TODO: Content\n`,
      "utf8"
    );

    console.log(`✓ Created .hansprint/${file}`);
  }
}

console.log("\nGovernance structure created successfully.");