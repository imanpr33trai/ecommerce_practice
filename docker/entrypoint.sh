
#!/bin/sh
# ==========================================
# entrypoint.sh
# Production entrypoint script with Prisma migration support
# ==========================================

set -e

# Environment variables (defaults)
NODE_ENV="${NODE_ENV:-production}"
PORT="${PORT:-3000}"
HOSTNAME="${HOSTNAME:-0.0.0.0}"
DATABASE_URL="${DATABASE_URL:-}"
AUTO_MIGRATE="${AUTO_MIGRATE:-false}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Logging helpers
log() {
  echo "${BLUE}[INFO]${NC} $1"
}

warn() {
  echo "${YELLOW}[WARN]${NC} $1"
}

error() {
  echo "${RED}[ERROR]${NC} $1"
}

# Ensure DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  error "DATABASE_URL environment variable is not set!"
  exit 1
fi

# Run Prisma migrations
run_migrations() {
  log "Running database migrations..."

  if npx prisma migrate deploy; then
    log "Database migrations completed successfully"
  else
    error "Database migrations failed!"
    exit 1
  fi
}

# Generate Prisma client
generate_prisma_client() {
  log "Generating Prisma client..."

  if npx prisma generate; then
    log "Prisma client generated successfully"
  else
    error "Failed to generate Prisma client!"
    exit 1
  fi
}

# ==========================================
# Main logic
# ==========================================

log "Starting application..."
log "Environment: $NODE_ENV"
log "Port: $PORT"
log "Hostname: $HOSTNAME"

# Handle migrations
if [ "$NODE_ENV" = "production" ]; then
  if [ "$AUTO_MIGRATE" = "true" ]; then
    warn "AUTO_MIGRATE enabled in production!"
    run_migrations
  else
    log "Skipping migrations in production (AUTO_MIGRATE=$AUTO_MIGRATE)"
  fi

elif [ "$NODE_ENV" = "development" ]; then
  log "Development mode: generating client + running migrations"
  generate_prisma_client
  run_migrations

else
  log "Running in $NODE_ENV mode (no migrations)"
fi

# Export runtime env vars
export NODE_ENV="$NODE_ENV"
export PORT="$PORT"
export HOSTNAME="$HOSTNAME"

# Start the app
log "Launching: $*"
exec "$@"
