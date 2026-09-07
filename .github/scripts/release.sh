#!/usr/bin/env bash

set -e

VERSION=$1

if [ -z "$VERSION" ]; then
    echo "Usage:"
    echo "./scripts/release.sh v0.2.0"
    exit 1
fi

./scripts/validate.sh

git add .

git commit -m "release: $VERSION"

git tag "$VERSION"

echo ""
echo "✓ Released $VERSION"