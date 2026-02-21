#!/bin/bash

# Production Deployment Script for E-commerce Monorepo (pnpm + Node.js)
# Usage: ./deploy-pnpm.sh [web|server|all] [environment]

set -e

# Default values
SERVICE=${1:-all}
ENVIRONMENT=${2:-production}

echo "🚀 Starting deployment process..."
echo "Service: $SERVICE"
echo "Environment: $ENVIRONMENT"
echo "Package Manager: pnpm"

# Function to deploy web app
deploy_web() {
    echo "📱 Deploying Next.js Web App..."
    cd apps/web
    
    # Install dependencies
    echo "📦 Installing dependencies..."
    cd ../.. && pnpm install --frozen-lockfile
    
    # Build web app
    echo "🔨 Building web app..."
    pnpm run build:web
    
    # Deploy to Vercel
    echo "🌐 Deploying to Vercel..."
    cd apps/web
    vercel --prod --token=$VERCEL_TOKEN
    
    echo "✅ Web app deployed successfully!"
}

# Function to deploy server
deploy_server() {
    echo "🔧 Deploying Hono Server API..."
    cd apps/server
    
    # Install dependencies
    echo "📦 Installing dependencies..."
    cd ../.. && pnpm install --frozen-lockfile
    
    # Build server
    echo "🔨 Building server..."
    pnpm run build:server
    
    # Deploy to Vercel
    echo "🌐 Deploying to Vercel..."
    cd apps/server
    vercel --prod --token=$VERCEL_SERVER_TOKEN
    
    echo "✅ Server deployed successfully!"
}

# Function to run health checks
health_check() {
    echo "🏥 Running health checks..."
    
    # Check web app
    if [ ! -z "$WEB_URL" ]; then
        echo "Checking web app at $WEB_URL..."
        curl -f -s -o /dev/null -w "%{http_code}" $WEB_URL/api/health || echo "⚠️ Web app health check failed"
    fi
    
    # Check server API
    if [ ! -z "$API_URL" ]; then
        echo "Checking API at $API_URL..."
        curl -f -s -o /dev/null -w "%{http_code}" $API_URL/health || echo "⚠️ API health check failed"
    fi
    
    echo "🏥 Health checks completed!"
}

# Function to validate environment
validate_environment() {
    echo "🔍 Validating environment..."
    
    # Check Node.js version
    NODE_VERSION=$(node --version | cut -d'v' -f2)
    REQUIRED_NODE="22.0.0"
    if [ "$(printf '%s\n' "$REQUIRED_NODE" "$NODE_VERSION" | sort -V | head -n1)" = "$REQUIRED_NODE" ]; then
        echo "✅ Node.js version $NODE_VERSION is compatible"
    else
        echo "❌ Node.js version $NODE_VERSION is not compatible. Required: >= $REQUIRED_NODE"
        exit 1
    fi
    
    # Check pnpm version
    PNPM_VERSION=$(pnpm --version)
    echo "✅ pnpm version $PNPM_VERSION"
    
    # Check if required environment variables are set for production
    if [ "$ENVIRONMENT" = "production" ]; then
        if [ -z "$VERCEL_TOKEN" ]; then
            echo "⚠️ VERCEL_TOKEN not set, using local Vercel CLI auth"
        fi
    fi
}

# Function to cleanup and optimize
cleanup_optimize() {
    echo "🧹 Cleaning up and optimizing..."
    
    # Clean previous builds
    pnpm run clean:build
    
    # Remove dev dependencies for production builds
    if [ "$ENVIRONMENT" = "production" ]; then
        echo "📦 Optimizing for production..."
        pnpm install --prod --frozen-lockfile
    fi
}

# Main deployment logic
case $SERVICE in
    "web")
        validate_environment
        cleanup_optimize
        deploy_web
        health_check
        ;;
    "server")
        validate_environment
        cleanup_optimize
        deploy_server
        health_check
        ;;
    "all")
        validate_environment
        cleanup_optimize
        deploy_web
        deploy_server
        health_check
        ;;
    *)
        echo "❌ Invalid service. Use: web, server, or all"
        exit 1
        ;;
esac

echo "🎉 Deployment completed successfully!"
