#!/bin/bash
# ==========================================
# Development Starter Script
# Hybrid JIT/AOT strategy for optimal performance
# ==========================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log() {
  echo -e "${BLUE}[INFO]${NC} $1"
}

success() {
  echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warn() {
  echo -e "${YELLOW}[WARN]${NC} $1"
}

# ==========================================
# Step 1: Prebuild stable packages (AOT)
# These rarely change, so build once
# ==========================================
log "Step 1: Prebuilding stable packages (AOT)..."

echo "  Building @ecomerceNextjs/env..."
pnpm --filter @ecomerceNextjs/env build > /dev/null 2>&1

echo "  Building @ecomerceNextjs/db..."
pnpm --filter @ecomerceNextjs/db build > /dev/null 2>&1

echo "  Building @ecomerceNextjs/auth..."
pnpm --filter @ecomerceNextjs/auth build > /dev/null 2>&1

success "Stable packages built!"

# ==========================================
# Step 2: Start development watchers
# Only watch actively developed packages
# ==========================================
log "Step 2: Starting development watchers..."
warn "Only watching: api, server, web"
echo ""
echo "  Stable packages (AOT): env, db, auth"
echo "  Watch mode (JIT): api, server, web"
echo ""

# Use turbo to run dev with proper dependency handling
# This will:
# - Watch api, server, web for changes
# - Use prebuilt dist/ for env, db, auth
pnpm turbo run dev \
  --filter=server... \
  --filter=web... \
  --concurrency=10
