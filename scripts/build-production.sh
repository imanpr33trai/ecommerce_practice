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

# Check required environment variables
required_vars=("DATABASE_URL" "NEXT_PUBLIC_SERVER_URL")
for var in "${required_vars[@]}"; do
    if [[ -z "${!var:-}" ]]; then
        echo "⚠️  Warning: ${var} not set"
    fi
done

# Build Docker image
echo "🔨 Building Docker image..."
docker build \
    --file docker/Dockerfile.production \
    --build-arg APP_NAME="${APP_NAME}" \
    --build-arg NODE_VERSION="${NODE_VERSION}" \
    --target runner \
    --tag "${REGISTRY}/${APP_NAME}:${TAG}" \
    --tag "${REGISTRY}/${APP_NAME}:${TAG}-$(date +%Y%m%d-%H%M%S)" \
    .

# Security scan
echo "🔒 Running security scan..."
if command -v trivy &> /dev/null; then
    trivy image --exit-code 1 --severity HIGH,CRITICAL "${REGISTRY}/${APP_NAME}:${TAG}"
else
    echo "⚠️  Trivy not found, skipping security scan"
fi

# Test the image
echo "🧪 Testing built image..."
container_id=$(docker run -d \
    -e NODE_ENV=production \
    -e PORT=3000 \
    -e DATABASE_URL="${DATABASE_URL:-file:./dev.db}" \
    -e NEXT_PUBLIC_SERVER_URL="http://localhost:3000" \
    -p 3001:3000 \
    "${REGISTRY}/${APP_NAME}:${TAG}")

# Wait for startup
echo "⏳ Waiting for application to start..."
sleep 10

# Health check
echo "🏥 Performing health check..."
if curl -f http://localhost:3001/api/health; then
    echo "✅ Health check passed"
else
    echo "❌ Health check failed"
    docker stop "${container_id}"
    exit 1
fi

# Cleanup
docker stop "${container_id}"
docker rm "${container_id}"

echo "🎉 Build completed successfully!"
echo "📊 Image size: $(docker images "${REGISTRY}/${APP_NAME}:${TAG}" --format "table {{.Size}}")"