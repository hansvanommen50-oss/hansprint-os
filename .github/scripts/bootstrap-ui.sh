#!/usr/bin/env bash

set -e

ROOT="packages/ui"

COMPONENTS=(
  container
  flex
  grid
  inline
  stack
)

for COMPONENT in "${COMPONENTS[@]}"; do

DIR="$ROOT/$COMPONENT"

mkdir -p "$DIR/src"

CLASS="$(tr '[:lower:]' '[:upper:]' <<< ${COMPONENT:0:1})${COMPONENT:1}"

########################################
# README
########################################

cat > "$DIR/README.md" << EOF
# $CLASS

Hansprint UI $CLASS component.
EOF

########################################
# package.json
########################################

cat > "$DIR/package.json" << EOF
{
  "name": "@hansprint/ui-$COMPONENT",
  "version": "0.2.0",
  "private": true,
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "scripts": {
    "build": "tsc -p tsconfig.json",
    "clean": "rm -rf dist"
  },
  "dependencies": {
    "@hansprint/core": "workspace:*",
    "@hansprint/tokens": "workspace:*"
  },
  "devDependencies": {
    "typescript": "^5.9.3"
  }
}
EOF

########################################
# tsconfig
########################################

cat > "$DIR/tsconfig.json" << EOF
{
  "extends": "../../../tsconfig.base.json",
  "compilerOptions": {
    "rootDir": "./src",
    "outDir": "./dist",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "target": "ES2022",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "strict": true
  },
  "include": [
    "src"
  ]
}
EOF

########################################
# index.ts
########################################

cat > "$DIR/src/index.ts" << EOF
export * from "./$CLASS.js";
export * from "./types.js";
EOF

echo "✔ $COMPONENT"

done

echo ""
echo "Bootstrap complete."