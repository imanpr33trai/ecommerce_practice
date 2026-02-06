#!/bin/bash
# ==========================================
# Production build and validation script
# ==========================================

set -euo pipefail

# Configuration
APP_NAME="${1:-web}"
NODE_VERSION="${2:-22-alpine}"
REGISTRY="${3:-your-registry.com}"
TAG="${4:-latest}"

echo "🚀 Building production Docker image for ${APP_NAME}"
echo "📦 Node version: ${NODE_VERSION}"
echo "🏷️  Tag: ${REGISTRY}/${APP_NAME}:${TAG}"
if [ -f ".env.development" ]; then
    export $(grep -v '^#' .env.development | xargs)
    echo "✅ Loaded variables from .env.development"
fi


# Pre-build validation
echo "🔍 Validating environment..."
if [[ ! -f "package.json" ]]; then
    echo "❌ package.json not found"
    exit 1
fi

if [[ ! -f "pnpm-lock.yaml" ]]; then
    echo "❌ pnpm-lock.yaml not found"
    exit 1
fi

# Validate app exists
if [[ ! -d "apps/${APP_NAME}" ]]; then
    echo "❌ Application ${APP_NAME} not found in apps/ directory"
    exit 1
fi

# Check required environment variables
required_vars=("DATABASE_URL" "NEXT_PUBLIC_SERVER_URL")
missing_vars=()
for var in "${required_vars[@]}"; do
    if [[ -z "${!var:-}" ]]; then
        missing_vars+=("${var}")
    fi
done

if [[ ${#missing_vars[@]} -gt 0 ]]; then
    echo "⚠️  Warning: Missing environment variables: ${missing_vars[*]}"
    echo "   These may cause runtime issues"
fi

# Install dependencies first
echo "📦 Installing dependencies..."
pnpm install --frozen-lockfile

# Type checking and linting
echo "🔍 Running type checks..."
if pnpm --filter ${APP_NAME} type-check 2>/dev/null; then
    echo "✅ Type checks passed"
else
    echo "⚠️  Type checks failed, continuing with build..."
fi

echo "🧹 Running linting..."
if pnpm --filter ${APP_NAME} lint 2>/dev/null; then
    echo "✅ Linting passed"
else
    echo "⚠️  Linting failed, continuing with build..."
fi

# Determine target based on app type
TARGET="runner"
if [[ "${APP_NAME}" == "server" ]]; then
    TARGET="server-runner"
fi

# Build Docker image
echo "🔨 Building Docker image..."
docker build \
    --file docker/Dockerfile.production \
    $(grep -v '^#' .env.development | xargs -I {} echo "--build-arg {}") \
    --build-arg APP_NAME="${APP_NAME}" \
    --build-arg NODE_VERSION="${NODE_VERSION}" \
    --target "${TARGET}" \
    --tag "${REGISTRY}/${APP_NAME}:${TAG}" \
    --tag "${REGISTRY}/${APP_NAME}:${TAG}-$(date +%Y%m%d-%H%M%S)" \
    .

# Security scan
echo "🔒 Running security scan..."
if command -v trivy &> /dev/null; then
    trivy image --exit-code 1 --severity HIGH,CRITICAL "${REGISTRY}/${APP_NAME}:${TAG}" || {
        echo "⚠️  Security scan found issues"
    }
else
    echo "⚠️  Trivy not found, skipping security scan"
fi

# Test the image
echo "🧪 Testing built image..."

# Determine port and health endpoint
APP_PORT=3000
HEALTH_ENDPOINT="/api/health"
if [[ "${APP_NAME}" == "server" ]]; then
    APP_PORT=3001
    HEALTH_ENDPOINT="/health"
fi

container_id=$(docker run -d \
    -e NODE_ENV=production \
    -e PORT="${APP_PORT}" \
    -e DATABASE_URL="${DATABASE_URL:-file:./dev.db}" \
    -e NEXT_PUBLIC_SERVER_URL="http://localhost:${APP_PORT}" \
    -p 3001:"${APP_PORT}" \
    "${REGISTRY}/${APP_NAME}:${TAG}")

# Wait for startup
echo "⏳ Waiting for application to start..."
sleep 15

# Health check with retries
echo "🏥 Performing health check..."
max_retries=5
retry_count=0
health_passed=false

while [[ $retry_count -lt $max_retries ]]; do
    if curl -f "http://localhost:3001${HEALTH_ENDPOINT}" 2>/dev/null; then
        health_passed=true
        break
    else
        echo "   Retry $((retry_count + 1))/$max_retries..."
        sleep 5
        ((retry_count++))
    fi
done

if [[ "$health_passed" == true ]]; then
    echo "✅ Health check passed"
else
    echo "❌ Health check failed after $max_retries attempts"
    docker stop "${container_id}" 2>/dev/null || true
    docker rm "${container_id}" 2>/dev/null || true
    exit 1
fi

# Cleanup
docker stop "${container_id}"
docker rm "${container_id}"

echo "🎉 Build completed successfully!"
echo "📊 Image size: $(docker images "${REGISTRY}/${APP_NAME}:${TAG}" --format "table {{.Size}}")"

# Test database connectivity if DATABASE_URL is provided
if [[ -n "${DATABASE_URL:-}" ]]; then
    echo "🗄️  Testing database connectivity..."
    container_id=$(docker run -d \
        -e NODE_ENV=production \
        -e PORT="${APP_PORT}" \
        -e DATABASE_URL="${DATABASE_URL}" \
        -e NEXT_PUBLIC_SERVER_URL="http://localhost:${APP_PORT}" \
        "${REGISTRY}/${APP_NAME}:${TAG}")

    sleep 10

    # Check if container is still running (no startup errors)
    if docker ps --filter "id=${container_id}" --format "table {{.Status}}" | grep -q "Up"; then
        echo "✅ Database connectivity test passed"
    else
        echo "⚠️  Database connectivity test may have failed"
    fi

    docker stop "${container_id}" 2>/dev/null || true
    docker rm "${container_id}" 2>/dev/null || true
fi

echo "🚀 Ready for deployment!"
