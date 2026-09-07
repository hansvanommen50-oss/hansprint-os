#!/usr/bin/env bash

set -e

./scripts/clean.sh
./scripts/build.sh
./scripts/doctor.sh

echo ""
echo "✓ Validation successful"