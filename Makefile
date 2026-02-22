# E-commerce Docker Commands

.PHONY: help build up down logs clean prod dev \
        build-web build-server build-all \
        web-shell server-shell db-shell \
        web-logs server-logs db-logs \
        db-migrate db-generate db-seed db-backup db-restore \
        status health restart \
        dev-restart dev-reset clean-all prune \
        rebuild reset \
        db-reset db-fresh db-status \
        format lint lint-fix type-check test \
        deploy-staging deploy-prod rollback version release \
        update audit sizes \
        ps stats \
        app-build app-up app-down app-restart app-logs app-clean \
        db-build db-up db-down db-restart db-clean db-shell \
        all-up all-down all-build all-clean \
        dev-db dev-app prod-db prod-app \
        start-db stop-db start-app stop-app restart-db restart-app \
        reset-all db-init

.DEFAULT_GOAL := help

help:
	@echo "Usage: make [command]"
	@echo ""
	@echo "Quick Start:"
	@echo "  make dev           Start development environment"
	@echo "  make prod          Start production environment"
	@echo "  make fresh         Clean and start fresh dev"
	@echo ""
	@echo "Build:"
	@echo "  make build-web     Build web container"
	@echo "  make build-server  Build server container"
	@echo "  make build-all     Build all containers"
	@echo "  make rebuild       Clean and rebuild"
	@echo ""
	@echo "Lifecycle:"
	@echo "  make up            Start services (detached)"
	@echo "  make down          Stop services"
	@echo "  make restart       Restart services"
	@echo "  make clean         Clean containers and volumes"
	@echo "  make clean-all     Remove everything"
	@echo "  make prune         Prune unused resources"
	@echo ""
	@echo "Development:"
	@echo "  make dev-restart   Restart dev environment"
	@echo "  make dev-reset     Full dev reset"
	@echo ""
	@echo "Shell Access:"
	@echo "  make web-shell     Shell into web container"
	@echo "  make server-shell  Shell into server container"
	@echo "  make db-shell      PostgreSQL CLI"
	@echo ""
	@echo "Logs:"
	@echo "  make logs          All logs"
	@echo "  make web-logs      Web logs"
	@echo "  make server-logs   Server logs"
	@echo "  make db-logs       Database logs"
	@echo ""
	@echo "Database:"
	@echo "  make db-migrate    Run migrations"
	@echo "  make db-generate   Generate Prisma client"
	@echo "  make db-seed       Seed database"
	@echo "  make db-backup     Backup database"
	@echo "  make db-restore    Restore backup"
	@echo "  make db-reset      Drop + migrate + seed"
	@echo "  make db-fresh      Full database reset"
	@echo "  make db-status     Migration status"
	@echo ""
	@echo "Quality:"
	@echo "  make format        Format code"
	@echo "  make lint          Run linter"
	@echo "  make lint-fix      Auto-fix linting"
	@echo "  make type-check    TypeScript check"
	@echo "  make test          Run tests"
	@echo ""
	@echo "Monitoring:"
	@echo "  make status        Service status"
	@echo "  make health        Health check"
	@echo "  make stats         Resource usage"
	@echo "  make ps            Running containers"
	@echo ""
	@echo "Deployment:"
	@echo "  make deploy-staging  Deploy to staging"
	@echo "  make deploy-prod    Deploy to production"
	@echo "  make rollback       Rollback deployment"
	@echo "  make version        Show version"
	@echo "  make release        Release build"
	@echo ""
	@echo "Maintenance:"
	@echo "  make update        Update dependencies"
	@echo "  make audit         Security audit"
	@echo "  make sizes         Show image sizes"
	@echo ""
	@echo "Separated Containers:"
	@echo "  make app-up        Start web + server"
	@echo "  make app-down      Stop web + server"
	@echo "  make app-build     Build app containers"
	@echo "  make db-up         Start database"
	@echo "  make db-down       Stop database"
	@echo "  make all-up        Start full stack"
	@echo "  make all-down      Stop full stack"

dev:
	docker compose up server-dev web-dev nginx postgres redis

prod:
	docker compose up --build

fresh: clean-all
	docker compose -f docker-compose.dev.yml up

rebuild: clean build-all

logs:
	docker compose logs -f

quick-dev:
	docker compose -f docker-compose.dev.yml up --no-build

reset: clean-all down
	docker compose -f docker-compose.dev.yml up

build-web:
	docker compose build web

build-server:
	docker compose build server

build-all:
	docker compose build --parallel

build: build-all

up:
	docker compose up -d

down:
	docker compose down

restart:
	docker compose restart

clean:
	docker compose down -v --remove-orphans

clean-all:
	docker compose down -v --remove-orphans --rmi all
	docker system prune -f

prune:
	docker system prune -f

prune-all:
	docker system prune -af --volumes
	docker builder prune -af

dev-logs:
	docker compose -f docker-compose.dev.yml logs -f

dev-restart:
	docker compose -f docker-compose.dev.yml restart

dev-reset:
	docker compose -f docker-compose.dev.yml down -v
	docker compose -f docker-compose.dev.yml up --build

web-shell:
	docker compose exec web /bin/sh

server-shell:
	docker compose exec server /bin/sh

db-shell:
	docker compose exec postgres psql -U postgres -d ecommerce

web-logs:
	docker compose logs -f web

server-logs:
	docker compose logs -f server

db-logs:
	docker compose logs -f postgres

db-migrate:
	docker compose exec server npx prisma migrate deploy

db-generate:
	docker compose exec server pnpm --filter @ecomerceNextjs/db db:generate

db-seed:
	docker compose exec server pnpm --filter @ecomerceNextjs/db db:seed

db-backup:
	docker compose exec postgres pg_dump -U postgres ecommerce > backup_$$(date +%Y%m%d_%H%M%S).sql

db-restore:
	docker compose exec -T postgres psql -U postgres ecommerce < $(BACKUP)

db-reset:
	docker compose exec server npx prisma migrate reset --force
	docker compose exec server pnpm --filter @ecomerceNextjs/db db:seed

db-fresh:
	docker compose down -v
	docker compose up --build -d postgres
	sleep 10
	docker compose exec postgres psql -U postgres -c "DROP DATABASE IF EXISTS ecommerce; CREATE DATABASE ecommerce;"
	docker compose exec server npx prisma migrate deploy
	docker compose exec server pnpm --filter @ecomerceNextjs/db db:seed

db-status:
	docker compose exec server npx prisma migrate status

db-validate:
	docker compose exec server npx prisma db pull

format:
	pnpm biome format --write .

lint:
	pnpm biome check .

lint-fix:
	pnpm biome check --write .

type-check:
	pnpm type-check

test:
	pnpm test

test-e2e:
	pnpm test:e2e

test-coverage:
	pnpm test --coverage

pre-commit: lint-fix type-check test

pre-push: test lint type-check test-coverage

status:
	docker compose ps
	docker stats --no-stream

health:
	docker compose exec postgres pg_isready -U postgres

stats:
	docker stats

ps:
	docker compose ps

deploy-staging:
	docker compose -f docker-compose.app.yml --env-file .env.development up --build

deploy-prod:
	docker compose -f docker-compose.app.yml --env-file .env.production up --build

rollback:
	docker compose down
	docker compose up -d

version:
	cat package.json | grep version

release: build-all

update:
	pnpm update --latest
	pnpm install

audit:
	pnpm audit

sizes:
	docker images ecommerce* --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}"

app-build:
	docker compose -f docker-compose.app.yml build

app-up:
	docker compose -f docker-compose.app.yml up -d

app-down:
	docker compose -f docker-compose.app.yml down

app-restart:
	docker compose -f docker-compose.app.yml restart

app-logs:
	docker compose -f docker-compose.app.yml logs -f

app-clean:
	docker compose -f docker-compose.app.yml down -v --remove-orphans

db-build:
	docker compose -f docker-compose.db.yml pull postgres

db-up:
	docker compose -f docker-compose.db.yml up -d

db-down:
	docker compose -f docker-compose.db.yml down

db-restart:
	docker compose -f docker-compose.db.yml restart

db-clean:
	docker compose -f docker-compose.db.yml down -v --remove-orphans

all-up:
	docker-compose up postgres -d
	sleep 5
	docker compose up server web nginx postgres redis -d

all-down:
	docker compose -f docker-compose.app.yml down
	docker compose -f docker-compose.db.yml down

all-build:
	docker compose -f docker-compose.db.yml pull
	docker compose -f docker-compose.app.yml build

all-clean:
	docker compose -f docker-compose.app.yml down -v --remove-orphans
	docker compose -f docker-compose.db.yml down -v --remove-orphans

dev-db:
	docker compose -f docker-compose.db.yml up -d

dev-app:
	docker compose -f docker-compose.dev.yml up

prod-db:
	docker compose -f docker-compose.db.yml up -d

prod-app:
	docker compose -f docker-compose.app.yml up --build

start-db: db-up
stop-db: db-down
start-app: app-up
stop-app: app-down
restart-db: db-restart
restart-app: app-restart

db-init:
	docker compose -f docker-compose.db.yml up -d
	sleep 10

reset-all:
	docker compose -f docker-compose.app.yml down -v --remove-orphans --rmi all
	docker compose -f docker-compose.db.yml down -v --remove-orphans
	docker system prune -f
