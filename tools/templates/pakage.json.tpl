{
  "name": "@hansprint/ui-{{kebab}}",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  },
  "files": [
    "dist"
  ],
  "scripts": {
    "build": "tsc -p tsconfig.json && cp src/{{Component}}.css dist/{{Component}}.css",
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