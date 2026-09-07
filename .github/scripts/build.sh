#!/usr/bin/env bash

set -e

echo ""
echo "==============================="
echo " Hansprint Build"
echo "==============================="
echo ""

pnpm -r build

echo ""
echo "✓ Build completed"