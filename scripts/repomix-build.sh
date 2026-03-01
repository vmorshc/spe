#!/bin/bash
set -e

echo "📦 Building repomix context files..."

# Build docs context (markdown files only, XML format)
npx repomix \
  --include "**/*.md" \
  --style xml \
  --no-file-summary \
  --output pickly-docs.txt

# Build code context (source code files only, XML format)
npx repomix \
  --include "src/**/*.ts,src/**/*.tsx,src/**/*.js,src/**/*.jsx,src/**/*.css" \
  --style xml \
  --no-file-summary \
  --output pickly-code.txt

echo "✅ Repomix context files updated!"
