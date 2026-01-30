#!/bin/bash

# Production Deployment Script for E-commerce Monorepo
# Usage: ./deploy.sh [web|server|all] [environment]

set -e

# Default values
SERVICE=${1:-all}
ENVIRONMENT=${2:-production}

echo "🚀 Starting deployment process..."
echo "Service: $SERVICE"
echo "Environment: $ENVIRONMENT"

# Function to deploy web app
deploy_web() {
    echo "📱 Deploying Next.js Web App..."
    cd apps/web
    
    # Install dependencies
    echo "📦 Installing dependencies..."
    cd ../.. && bun install --frozen-lockfile
    
    # Build web app
    echo "🔨 Building web app..."
    bun run build:web
    
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
    cd ../.. && bun install --frozen-lockfile
    
    # Build server
    echo "🔨 Building server..."
    bun run build:server
    
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
        curl -f $WEB_URL/health || echo "⚠️ Web app health check failed"
    fi
    
    # Check server API
    if [ ! -z "$API_URL" ]; then
        echo "Checking API at $API_URL..."
        curl -f $API_URL/health || echo "⚠️ API health check failed"
    fi
    
    echo "🏥 Health checks completed!"
}

# Main deployment logic
case $SERVICE in
    "web")
        deploy_web
        health_check
        ;;
    "server")
        deploy_server
        health_check
        ;;
    "all")
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