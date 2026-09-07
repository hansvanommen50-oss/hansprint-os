#!/usr/bin/env bash

mkdir -p snapshots

STAMP=$(date +"%Y%m%d-%H%M")

git archive \
    --format zip \
    -o snapshots/$STAMP.zip \
    HEAD

echo ""
echo "Snapshot:"
echo "snapshots/$STAMP.zip"