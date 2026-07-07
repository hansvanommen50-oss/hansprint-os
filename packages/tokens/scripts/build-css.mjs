import fs from "node:fs";
import path from "node:path";

import { generateCssVariables } from "../dist/css/generator.js";

const css = generateCssVariables();

const outfile = path.resolve(
  "dist",
  "tokens.css"
);

fs.writeFileSync(outfile, css);

console.log(`✓ Generated ${outfile}`);