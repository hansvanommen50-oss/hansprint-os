#!/usr/bin/env bash
set -e

echo "======================================"
echo " Hansprint OS - Sprint 6.2"
echo " ESLint TypeScript Upgrade"
echo "======================================"

echo ""
echo "Installing TypeScript ESLint..."

pnpm add -Dw \
  typescript-eslint \
  eslint-plugin-import \
  eslint-plugin-unused-imports \
  eslint-plugin-simple-import-sort

echo ""
echo "Installed:"
echo "  ✓ typescript-eslint"
echo "  ✓ eslint-plugin-import"
echo "  ✓ eslint-plugin-unused-imports"
echo "  ✓ eslint-plugin-simple-import-sort"

echo ""
echo "Next step:"
echo "Replace eslint.config.mjs with the Sprint 6.2 configuration."

echo ""
echo "Done."