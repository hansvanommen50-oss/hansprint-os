#!/usr/bin/env bash

set -e

echo "Cleaning workspace..."

find . -name dist -type d -prune -exec rm -rf {} +
find . -name "*.tsbuildinfo" -delete
find . -name "*.js.map" -delete
find . -name "*.d.ts.map" -delete

echo "✓ Workspace cleaned"