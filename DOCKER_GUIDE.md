# E-commerce Docker Setup Guide

This guide covers everything you need to know about using Docker for your e-commerce project with Next.js, Hono, and PostgreSQL.

## Table of Contents

1. [Quick Start](#quick-start)
2. [Development Environment](#development-environment)
3. [Production Environment](#production-environment)
4. [Database Management](#database-management)
5. [Monitoring and Health Checks](#monitoring-and-health-checks)
6. [Service Management](#service-management)
7. [Troubleshooting](#troubleshooting)
8. [Advanced Usage](#advanced-usage)

## Quick Start

### Development

```bash
# Start development environment with hot reload
make dev

# Follow development logs
make dev-logs

# Access services
make web-shell      # Shell into web container
make server-shell   # Shell into server container
make db-shell       # PostgreSQL CLI
```

### Production

```bash
# Start production with local PostgreSQL
make prod

# Start production with Neon database
make neon-up

# Check service health
make health
```

## Development Environment

### Starting Development

The development environment provides hot reload, volume mounts, and live code updates without rebuilding containers.

```bash
make dev
```

This will:
- Start PostgreSQL, Hono server, and Next.js web app
- Set up volume mounts for live code updates
- Enable auto-migrations
- Start with hot reload enabled

### Development Commands

```bash
# Development lifecycle
make dev-restart    # Restart dev environment
make dev-reset      # Full dev reset with volumes
make quick-dev      # Start dev without build (cached)

# Development logs
make dev-logs       # Follow dev logs
make logs-all       # Tail all logs

# Service access
make web-shell      # Shell into web container
make server-shell   # Shell into server container
make db-shell       # PostgreSQL CLI
```

### Environment Variables

Development uses `.env.development` which includes:
- Auto-migrations enabled
- Debug logging
- Polling for file changes
- Development secrets

## Production Environment

### Starting Production

```bash
# Local PostgreSQL production
make prod

# Neon database production
make neon-up
```

### Production Commands

```bash
# Production lifecycle
make up             # Start services detached
make down           # Stop and remove services
make restart        # Restart all services
make clean          # Clean containers, images, volumes
make clean-all      # Remove everything including images

# Production monitoring
make health         # Health check all services
make status         # Service status and resource usage
make stats          # Real-time resource usage

# Production logs
make logs           # Show all logs
make web-logs       # Web logs only
make server-logs    # Server logs only
make db-logs        # Database logs
```

### Production Environment Variables

Production uses `.env.production` which includes:
- Auto-migrations disabled (manual control)
- Info logging
- Production secrets
- Optimized settings

## Database Management

### Migrations

The system supports both auto-migrations and manual migrations:

```bash
# Auto-migrations (development)
# Enabled by default in development
# Can be controlled with AUTO_MIGRATE=true/false

# Manual migrations (production)
make db-migrate      # Run Prisma migrations
make db-rollback     # Rollback migrations
make db-status       # Check migration status

# Database operations
make db-generate     # Generate Prisma client
make db-seed         # Seed database
make db-reset        # Drop + migrate + seed
make db-fresh        # Full database reset
make db-seed-fresh   # Reset + seed with fresh data
make db-validate     # Validate database schema

# Backups and restore
make db-backup       # Backup database
make db-restore      # Restore from backup (use: make db-restore BACKUP=backup.sql)
```

### Database Commands

```bash
# Quick database operations
make db-migrate      # Run migrations
make db-seed         # Seed database
make db-backup       # Create backup
make db-restore      # Restore from backup

# Advanced database operations
make db-reset        # Drop + migrate + seed
make db-fresh        # Full database reset
make db-validate     # Validate database schema
```

## Monitoring and Health Checks

### Health Checks

```bash
make health          # Check all services health
make status          # Service status and resource usage
make stats           # Real-time resource usage
make ps              # Running containers
```

### Health Check Details

The system includes HTTP health endpoints:
- Web: `/api/health`
- Server: `/health`
- Database: PostgreSQL connectivity

### Monitoring Commands

```bash
# Service monitoring
make health          # Check all services health
make status          # Service status and resource usage
make stats           # Real-time resource usage

# Container monitoring
make ps              # Running containers
make logs            # Show all logs
make web-logs        # Web logs only
make server-logs     # Server logs only
make db-logs         # Database logs
```

## Service Management

### Accessing Services

```bash
# Shell access
make web-shell       # Shell into web container
make server-shell    # Shell into server container
make db-shell        # PostgreSQL CLI

# Log access
make web-logs        # Web logs only
make server-logs     # Server logs only
make db-logs         # Database logs
```

### Service Commands

```bash
# Service lifecycle
make up              # Start services detached
make down            # Stop and remove services
make restart         # Restart all services

# Service management
make clean           # Clean containers, images, volumes
make clean-all       # Remove everything including images
make prune           # Prune unused Docker resources
make prune-all       # Deep clean Docker
```

## Quality and Testing

### Code Quality

```bash
# Pre-commit checks
make pre-commit      # Run lint + type-check + test
make pre-push        # Full CI check before push

# Code formatting
make format          # Format all code
make lint-fix        # Auto-fix linting issues
make lint            # Run linter

# Testing
make test            # Run all tests
make test-e2e        # Run E2E tests
make test-coverage   # Tests with coverage
make type-check      # TypeScript check
```

### Quality Commands

```bash
# Code quality
make pre-commit      # Pre-commit checks
make pre-push        # Pre-push checks
make format          # Format code
make lint-fix        # Auto-fix linting
make lint            # Linting

# Testing
make test            # All tests
make test-e2e        # E2E tests
make test-coverage   # Tests with coverage
make type-check      # TypeScript check
```

## Advanced Usage

### Build Commands

```bash
# Build commands
make build-web       # Build web container only
make build-server    # Build server container only
make build-all       # Build all containers
make rebuild         # Clean + build all containers
```

### Deployment Commands

```bash
# Deployment
make deploy-staging  # Deploy to staging
make deploy-prod     # Deploy to production
make rollback        # Rollback last deployment
make version         # Show current version
make release         # Create release build
```

### Maintenance Commands

```bash
# Maintenance
make update          # Update all dependencies
make audit           # Security audit
make sizes           # Show image sizes
```

## Environment Configuration

### Environment Files

- `.env.development` - Development environment variables
- `.env.production` - Production environment variables  
- `.env.example` - Template for creating environment files
- `.env.development.local` - Local development overrides
- `.env.production.local` - Local production overrides

### Auto-Migration Control

You can control auto-migrations with the `AUTO_MIGRATE` environment variable:

```bash
# Development (default)
AUTO_MIGRATE=true

# Production (default)
AUTO_MIGRATE=false
```

## Troubleshooting

### Common Issues

#### Containers Won't Start

```bash
# Check logs
make logs

# Check health
make health

# Check status
make status
```

#### Database Connection Issues

```bash
# Check database logs
make db-logs

# Check database health
make health

# Check database status
make db-status
```

#### Build Issues

```bash
# Clean and rebuild
make clean
make build-all

# Deep clean
make prune-all
```

### Debug Commands

```bash
# Shell access for debugging
make web-shell
make server-shell
make db-shell

# Real-time monitoring
make stats
make ps
```

## File Structure

```
docker/
├── Dockerfile.web.production     # Next.js production
├── Dockerfile.server.production  # Hono server production  
├── Dockerfile.web.dev           # Next.js development
├── Dockerfile.server.dev        # Hono server development
├── docker-compose.yml           # Production compose
├── docker-compose.dev.yml       # Development compose
├── entrypoint.sh               # Production entrypoint
├── wait-for-it.sh              # Service dependency script
└── init-db.sql                 # Database initialization

.env.development               # Development environment
.env.production               # Production environment
.env.example                  # Environment template
.env.development.local        # Local development overrides
.env.production.local         # Local production overrides

Makefile                        # Comprehensive commands
DOCKER_GUIDE.md                 # This documentation
```

## Performance Tips

### Development Performance

- Use `make quick-dev` for faster startup without rebuilding
- Volume mounts provide live code updates
- Auto-migrations enabled for convenience

### Production Performance

- Multi-stage builds optimize image size
- Non-root users for security
- Health checks for reliability
- Resource limits for stability

## Security Considerations

### Environment Variables

- Never commit secrets to version control
- Use `.env.local` files for local overrides
- Production secrets should be set via environment

### Container Security

- Non-root users for all services
- Minimal base images (Alpine)
- Health checks for reliability
- Resource limits for security

## Support

For issues and questions:
1. Check the logs with `make logs`
2. Check service health with `make health`
3. Check status with `make status`
4. Review this documentation
5. Check container logs with `make web-logs`, `make server-logs`, or `make db-logs`

---

**Last Updated:** 2026-02-09  
**Version:** 1.0  
**Docker Version:** 27.0+ recommended