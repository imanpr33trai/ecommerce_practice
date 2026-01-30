.PHONY: help build up down logs clean prod dev test

# Default target
help:
	@echo "Available commands:"
	@echo "  build    - Build all Docker images"
	@echo "  up       - Start all services"
	@echo "  down     - Stop and remove all services"
	@echo "  logs     - Show logs for all services"
	@echo "  clean    - Remove Docker images, containers, and volumes"
	@echo "  prod     - Deploy to production"
	@echo "  dev      - Start development environment"
	@echo "  test     - Run tests in Docker"
	@echo "  status   - Show status of all services"

# Build images
build:
	docker compose build --parallel

# Start services
up:
	docker compose up -d

# Stop services
down:
	docker compose down -v

# Show logs
logs:
	docker compose logs -f

# Clean everything
clean: down
	@echo "Removing Docker images..."
	docker compose down --rmi all --volumes --remove-orphans
	@echo "Removing unused Docker resources..."
	docker system prune -f

# Production deployment
prod:
	@echo "Deploying to production..."
	cp .docker/.env.production .env
	docker compose -f docker-compose.yml up -d --build

# Development environment
dev:
	@echo "Starting development environment..."
	cp .docker/.env.development .env
	docker compose -f docker-compose.yml -f docker-compose.override.yml up -d --build

# Run tests
test:
	@echo "Running tests..."
	docker compose -f docker-compose.yml -f docker-compose.test.yml up --build --abort-on-container-exit

# Show status
status:
	docker compose ps
	@echo ""
	@echo "Resource usage:"
	docker stats --no-stream

# Individual service commands
db-logs:
	docker compose logs -f postgres

web-logs:
	docker compose logs -f web

server-logs:
	docker compose logs -f server

db-shell:
	docker compose exec postgres psql -U ${POSTGRES_USER:-postgres} -d ${POSTGRES_DB:-monorepo}

web-shell:
	docker compose exec web /bin/bash

server-shell:
	docker compose exec server /bin/bash

# Maintenance
db-backup:
	docker compose exec postgres pg_dump -U ${POSTGRES_USER:-postgres} ${POSTGRES_DB:-monorepo} > backup_$(shell date +%Y%m%d_%H%M%S).sql

db-restore:
	@echo "Usage: make db-restore BACKUP=backup_file.sql"
	docker compose exec -T postgres psql -U ${POSTGRES_USER:-postgres} ${POSTGRES_DB:-monorepo} < $(BACKUP)

# Health checks
health:
	@echo "Checking service health..."
	@curl -f http://localhost:3000/api/health || echo "Web service is down"
	@curl -f http://localhost:3001/health || echo "Server service is down"
	@docker compose exec postgres pg_isready -U ${POSTGRES_USER:-postgres} || echo "Database is down"