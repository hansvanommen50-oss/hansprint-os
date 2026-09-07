#!/usr/bin/env bash

echo ""
echo "Hansprint Doctor"
echo "----------------"

echo "Node : $(node -v)"
echo "pnpm : $(pnpm -v)"
echo "TypeScript : $(pnpm exec tsc -v)"

echo ""
echo "Workspace packages"

find packages -maxdepth 2 -name package.json

echo ""
echo "✓ Doctor finished"