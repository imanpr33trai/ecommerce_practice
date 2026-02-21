# ==========================================
# E-commerce Docker Commands
# Comprehensive Docker management for Next.js + Hono + PostgreSQL
# ==========================================

.PHONY: help build up down logs clean prod dev \
        build-web build-server build-all \
        web-shell server-shell db-shell \
        web-logs server-logs db-logs dev-logs \
        db-migrate db-generate db-seed db-backup db-restore \
        status health restart neon neon-up neon-down \
        dev-restart dev-reset clean-all prune \
        fresh rebuild logs-all quick-dev reset \
        db-reset db-fresh db-status db-seed-fresh db-validate \
        pre-commit pre-push format lint-fix test test-e2e test-coverage \
        type-check test \
        deploy-staging deploy-prod rollback version release \
        update audit sizes prune-all \
        ps stats \
        web-logs server-logs db-logs \
        app-build app-up app-down app-restart app-logs app-clean \
        db-build db-up db-down db-restart db-logs db-clean db-shell-standalone db-init \
        all-up all-down all-build all-clean \
        dev-db dev-app prod-db prod-app \
        start-db stop-db start-app stop-app restart-db restart-app \
        reset-all

# Default target
.DEFAULT_GOAL := help

# Colors for output
BLUE := \033[36m
GREEN := \033[32m
YELLOW := \033[33m
RED := \033[31m
NC := \033[0m # No Color

# ==========================================
# Help and Documentation
# ==========================================

help: ## Show all available commands
	@echo "${BLUE}\u2554\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2557${NC}"
	@echo "${BLUE}\u2551        E-commerce Docker Commands                      \u2551${NC}"
	@echo "${BLUE}\u255a\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u255d${NC}"
	@echo ""
	@echo "${GREEN}Quick Start:${NC}"
	@echo "  ${YELLOW}make dev${NC}           Start development environment (hot reload)"
	@echo "  ${YELLOW}make prod${NC}          Start production with local PostgreSQL"
	@echo "  ${YELLOW}make neon-up${NC}       Start production with Neon database"
	@echo "  ${YELLOW}make fresh${NC}         Clean everything and start fresh dev"
	@echo ""
	@echo "${GREEN}Build Commands:${NC}"
	@echo "  ${YELLOW}make build-web${NC}     Build web container only"
	@echo "  ${YELLOW}make build-server${NC}  Build server container only"
	@echo "  ${YELLOW}make build-all${NC}     Build all containers"
	@echo "  ${YELLOW}make rebuild${NC}       Clean + build all containers"
	@echo ""
	@echo "${GREEN}Lifecycle Commands:${NC}"
	@echo "  ${YELLOW}make up${NC}            Start services (detached)"
	@echo "  ${YELLOW}make down${NC}          Stop and remove services"
	@echo "  ${YELLOW}make restart${NC}       Restart all services"
	@echo "  ${YELLOW}make clean${NC}         Clean containers, images, volumes"
	@echo "  ${YELLOW}make clean-all${NC}     Remove everything including images"
	@echo "  ${YELLOW}make prune${NC}         Prune unused Docker resources"
	@echo "  ${YELLOW}make prune-all${NC}     Deep clean Docker"
	@echo ""
	@echo "${GREEN}Development:${NC}"
	@echo "  ${YELLOW}make dev-logs${NC}      Follow dev logs"
	@echo "  ${YELLOW}make dev-restart${NC}   Restart dev environment"
	@echo "  ${YELLOW}make dev-reset${NC}     Full dev reset with volumes"
	@echo "  ${YELLOW}make logs-all${NC}      Tail all logs"
	@echo "  ${YELLOW}make quick-dev${NC}     Start dev without build (cached)"
	@echo "  ${YELLOW}make reset${NC}         Full reset (volumes, images, containers)"
	@echo ""
	@echo "${GREEN}Service Management:${NC}"
	@echo "  ${YELLOW}make web-shell${NC}     Shell into web container"
	@echo "  ${YELLOW}make server-shell${NC}  Shell into server container"
	@echo "  ${YELLOW}make db-shell${NC}      PostgreSQL CLI"
	@echo "  ${YELLOW}make web-logs${NC}      Web logs only"
	@echo "  ${YELLOW}make server-logs${NC}   Server logs only"
	@echo "  ${YELLOW}make db-logs${NC}       Database logs"
	@echo ""
	@echo "${GREEN}Database Operations:${NC}"
	@echo "  ${YELLOW}make db-migrate${NC}    Run Prisma migrations"
	@echo "  ${YELLOW}make db-generate${NC}   Generate Prisma client"
	@echo "  ${YELLOW}make db-seed${NC}       Seed database"
	@echo "  ${YELLOW}make db-backup${NC}     Backup database"
	@echo "  ${YELLOW}make db-restore${NC}    Restore from backup"
	@echo "  ${YELLOW}make db-reset${NC}      Drop + migrate + seed"
	@echo "  ${YELLOW}make db-fresh${NC}      Full database reset"
	@echo "  ${YELLOW}make db-status${NC}     Check migration status"
	@echo "  ${YELLOW}make db-seed-fresh${NC}  Reset + seed with fresh data"
	@echo "  ${YELLOW}make db-validate${NC}   Validate database schema"
	@echo ""
	@echo "${GREEN}Quality:${NC}"
	@echo "  ${YELLOW}make pre-commit${NC}    Run lint + type-check + test"
	@echo "  ${YELLOW}make pre-push${NC}      Full CI check before push"
	@echo "  ${YELLOW}make format${NC}        Format all code"
	@echo "  ${YELLOW}make lint-fix${NC}       Auto-fix linting issues"
	@echo "  ${YELLOW}make test${NC}          Run all tests"
	@echo "  ${YELLOW}make test-e2e${NC}       Run E2E tests"
	@echo "  ${YELLOW}make test-coverage${NC}  Tests with coverage"
	@echo "  ${YELLOW}make type-check${NC}     TypeScript check"
	@echo ""
	@echo "${GREEN}Monitoring:${NC}"
	@echo "  ${YELLOW}make status${NC}        Service status and resource usage"
	@echo "  ${YELLOW}make health${NC}        Health check all services"
	@echo "  ${YELLOW}make stats${NC}         Real-time resource usage"
	@echo "  ${YELLOW}make ps${NC}            Running containers"
	@echo ""
	@echo "${GREEN}Deployment:${NC}"
	@echo "  ${YELLOW}make deploy-staging${NC} Deploy to staging"
	@echo "  ${YELLOW}make deploy-prod${NC}    Deploy to production"
	@echo "  ${YELLOW}make rollback${NC}       Rollback last deployment"
	@echo "  ${YELLOW}make version${NC}       Show current version"
	@echo "  ${YELLOW}make release${NC}        Create release build"
	@echo ""
	@echo "${GREEN}Separated Containers:${NC}"
	@echo "  ${YELLOW}make db-up${NC}         Start database only"
	@echo "  ${YELLOW}make db-down${NC}       Stop database only"
	@echo "  ${YELLOW}make db-clean${NC}      Clean database volumes"
	@echo "  ${YELLOW}make app-up${NC}        Start web + server only"
	@echo "  ${YELLOW}make app-down${NC}      Stop web + server only"
	@echo "  ${YELLOW}make app-build${NC}     Build web + server"
	@echo "  ${YELLOW}make all-up${NC}        Start full stack (db + app)"
	@echo "  ${YELLOW}make all-down${NC}      Stop full stack"
	@echo ""
	@echo "${GREEN}Maintenance:${NC}"
	@echo "  ${YELLOW}make update${NC}        Update all dependencies"
	@echo "  ${YELLOW}make audit${NC}         Security audit"
	@echo "  ${YELLOW}make sizes${NC}         Show image sizes"
	@echo "  ${YELLOW}make neon-up${NC}       Start with Neon database"
	@echo "  ${YELLOW}make neon-down${NC}     Stop Neon environment"
	@echo ""
	@echo "${BLUE}For detailed documentation, see DOCKER_GUIDE.md${NC}"

# ==========================================
# Quick Start Commands
# ==========================================

dev: ## Start development environment with hot reload
	@echo "${GREEN}Starting development environment...${NC}"
	@docker compose -f docker-compose.dev.yml up

prod: ## Start production with local PostgreSQL
	@echo "${GREEN}Starting production environment...${NC}"
	@docker compose up --build

neon-up: ## Start production with Neon database
	@echo "${GREEN}Starting production with Neon database...${NC}"
	@docker compose --env-file .env.production up --build

neon-down: ## Stop Neon production environment
	@echo "${YELLOW}Stopping Neon production environment...${NC}"
	@docker compose --env-file .env.production down

neon: neon-up ## Alias for neon-up

fresh: clean-all dev ## Clean everything and start fresh dev
rebuild: clean build-all ## Clean + rebuild all containers
logs-all: ## Tail all logs
	@echo "${BLUE}Following all logs...${NC}"
	@docker compose logs -f
quick-dev: ## Start dev without build (cached)
	@echo "${GREEN}Starting dev with cached build...${NC}"
	@docker compose -f docker-compose.dev.yml up --no-build
reset: clean-all down ## Full reset (volumes, images, containers)

# ==========================================
# Build Commands
# ==========================================

build-web: ## Build web container only
	@echo "${BLUE}Building web container...${NC}"
	@docker compose build web

build-server: ## Build server container only
	@echo "${BLUE}Building server container...${NC}"
	@docker compose build server

build-all: ## Build all containers
	@echo "${BLUE}Building all containers...${NC}"
	@docker compose build --parallel

build: build-all ## Alias for build-all

# ==========================================
# Lifecycle Commands
# ==========================================

up: ## Start services in detached mode
	@echo "${GREEN}Starting services...${NC}"
	@docker compose up -d

down: ## Stop and remove services
	@echo "${YELLOW}Stopping services...${NC}"
	@docker compose down

restart: ## Restart all services
	@echo "${YELLOW}Restarting services...${NC}"
	@docker compose restart

clean: ## Clean containers, images, and volumes
	@echo "${RED}Cleaning Docker resources...${NC}"
	@docker compose down -v --remove-orphans
	@echo "${GREEN}Clean complete!${NC}"

clean-all: ## Remove everything including images
	@echo "${RED}Removing all Docker resources...${NC}"
	@docker compose down -v --remove-orphans --rmi all
	@docker system prune -f
	@echo "${GREEN}All resources cleaned!${NC}"

prune: ## Prune unused Docker resources
	@echo "${YELLOW}Pruning Docker resources...${NC}"
	@docker system prune -f

prune-all: ## Deep clean Docker
	@echo "${RED}Deep cleaning Docker resources...${NC}"
	@docker system prune -af --volumes
	@docker builder prune -af
	@echo "${GREEN}Deep clean complete!${NC}"

# ==========================================
# Development Commands
# ==========================================

dev-logs: ## Follow development logs
	@echo "${BLUE}Following dev logs...${NC}"
	@docker compose -f docker-compose.dev.yml logs -f

dev-restart: ## Restart dev environment
	@echo "${YELLOW}Restarting dev environment...${NC}"
	@docker compose -f docker-compose.dev.yml restart

dev-reset: ## Full dev reset with volumes
	@echo "${RED}Resetting dev environment...${NC}"
	@docker compose -f docker-compose.dev.yml down -v
	@docker compose -f docker-compose.dev.yml up --build

# ==========================================
# Service Shell Access
# ==========================================

web-shell: ## Shell into web container
	@echo "${BLUE}Accessing web container...${NC}"
	@docker compose exec web /bin/sh

server-shell: ## Shell into server container
	@echo "${BLUE}Accessing server container...${NC}"
	@docker compose exec server /bin/sh

db-shell: ## PostgreSQL CLI
	@echo "${BLUE}Accessing PostgreSQL...${NC}"
	@docker compose exec postgres psql -U postgres -d ecommerce

# ==========================================
# Log Commands
# ==========================================

logs: ## Show all logs
	@echo "${BLUE}Showing all logs...${NC}"
	@docker compose logs -f

web-logs: ## Web logs only
	@echo "${BLUE}Showing web logs...${NC}"
	@docker compose logs -f web

server-logs: ## Server logs only
	@echo "${BLUE}Showing server logs...${NC}"
	@docker compose logs -f server

db-logs: ## Database logs
	@echo "${BLUE}Showing database logs...${NC}"
	@docker compose logs -f postgres

# ==========================================
# Database Operations
# ==========================================

db-migrate: ## Run Prisma migrations
	@echo "${BLUE}Running migrations...${NC}"
	@docker compose exec server npx prisma migrate deploy

db-generate: ## Generate Prisma client
	@echo "${BLUE}Generating Prisma client...${NC}"
	@docker compose exec server pnpm --filter @ecomerceNextjs/db db:generate

db-seed: ## Seed database
	@echo "${BLUE}Seeding database...${NC}"
	@docker compose exec server pnpm --filter @ecomerceNextjs/db db:seed

db-backup: ## Backup database
	@echo "${BLUE}Creating database backup...${NC}"
	@docker compose exec postgres pg_dump -U postgres ecommerce > backup_$(shell date +%Y%m%d_%H%M%S).sql
	@echo "${GREEN}Backup created!${NC}"

db-restore: ## Restore from backup (use: make db-restore BACKUP=backup_file.sql)
ifndef BACKUP
	@echo "${RED}Error: Please specify BACKUP file${NC}"
	@echo "${YELLOW}Usage: make db-restore BACKUP=backup_file.sql${NC}"
	@exit 1
endif
	@echo "${BLUE}Restoring from $(BACKUP)...${NC}"
	@docker compose exec -T postgres psql -U postgres ecommerce < $(BACKUP)
	@echo "${GREEN}Restore complete!${NC}"

db-reset: ## Drop + migrate + seed
	@echo "${YELLOW}Resetting database (drop + migrate + seed)...${NC}"
	@docker compose exec server npx prisma migrate reset --force
	@docker compose exec server pnpm --filter @ecomerceNextjs/db db:seed
	@echo "${GREEN}Database reset complete!${NC}"

db-fresh: ## Full database reset
	@echo "${RED}Full database reset...${NC}"
	@docker compose down -v
	@docker compose up --build -d postgres
	@sleep 10
	@docker compose exec postgres psql -U postgres -c "DROP DATABASE IF EXISTS ecommerce; CREATE DATABASE ecommerce;"
	@docker compose exec server npx prisma migrate deploy
	@docker compose exec server pnpm --filter @ecomerceNextjs/db db:seed
	@echo "${GREEN}Full database reset complete!${NC}"

db-status: ## Check migration status
	@echo "${BLUE}Checking migration status...${NC}"
	@docker compose exec server npx prisma migrate status

db-seed-fresh: ## Reset + seed with fresh data
	@echo "${YELLOW}Resetting and seeding with fresh data...${NC}"
	@make db-reset
	@docker compose exec server pnpm --filter @ecomerceNextjs/db db:seed --fresh
	@echo "${GREEN}Fresh seed complete!${NC}"

db-validate: ## Validate database schema
	@echo "${BLUE}Validating database schema...${NC}"
	@docker compose exec server npx prisma db pull
	@echo "${GREEN}Schema validation complete!${NC}"

# ==========================================
# Quality Commands
# ==========================================

pre-commit: ## Run lint + type-check + test
	@echo "${BLUE}Running pre-commit checks...${NC}"
	@make lint-fix
	@make type-check
	@make test
	@echo "${GREEN}Pre-commit checks passed!${NC}"

pre-push: ## Full CI check before push
	@echo "${BLUE}Running pre-push checks...${NC}"
	@make test
	@make lint
	@make type-check
	@make test-coverage
	@echo "${GREEN}Pre-push checks passed!${NC}"

format: ## Format all code
	@echo "${BLUE}Formatting code...${NC}"
	@pnpm biome format --write .

lint-fix: ## Auto-fix linting issues
	@echo "${BLUE}Auto-fixing linting issues...${NC}"
	@pnpm biome check --write .

lint: ## Run linter
	@echo "${BLUE}Running linter...${NC}"
	@pnpm biome check .

test: ## Run all tests
	@echo "${BLUE}Running tests...${NC}"
	@pnpm test

test-e2e: ## Run E2E tests
	@echo "${BLUE}Running E2E tests...${NC}"
	@pnpm test:e2e

test-coverage: ## Run tests with coverage
	@echo "${BLUE}Running tests with coverage...${NC}"
	@pnpm test --coverage

type-check: ## TypeScript check
	@echo "${BLUE}Running TypeScript check...${NC}"
	@pnpm type-check

# ==========================================
# Monitoring Commands
# ==========================================

status: ## Show service status and resource usage
	@echo "${BLUE}Service Status:${NC}"
	@docker compose ps
	@echo ""
	@echo "${BLUE}Resource Usage:${NC}"
	@docker stats --no-stream

health: ## Health check all services
	@echo "${BLUE}Checking service health...${NC}"
	@echo "Web service:"
	@curl -f http://localhost:3000/api/health 2>/dev/null && echo "${GREEN}\u2713 Web is healthy${NC}" || echo "${RED}\u2717 Web is down${NC}"
	@echo "Server service:"
	@curl -f http://localhost:3001/health 2>/dev/null && echo "${GREEN}\u2713 Server is healthy${NC}" || echo "${RED}\u2717 Server is down${NC}"
	@echo "Database:"
	@docker compose exec postgres pg_isready -U postgres 2>/dev/null && echo "${GREEN}\u2713 Database is healthy${NC}" || echo "${RED}\u2717 Database is down${NC}"

stats: ## Real-time resource usage
	@echo "${BLUE}Real-time resource usage...${NC}"
	@docker stats

ps: ## Running containers
	@echo "${BLUE}Running containers:${NC}"
	@docker compose ps

# ==========================================
# Deployment Commands
# ==========================================

deploy-staging: ## Deploy to staging
	@echo "${GREEN}Deploying to staging...${NC}"
	@echo "Staging deployment not configured yet"
	@echo "${YELLOW}Please configure your staging deployment${NC}"

deploy-prod: ## Deploy to production
	@echo "${GREEN}Deploying to production...${NC}"
	@echo "Production deployment not configured yet"
	@echo "${YELLOW}Please configure your production deployment${NC}"

rollback: ## Rollback last deployment
	@echo "${YELLOW}Rolling back last deployment...${NC}"
	@echo "Rollback not configured yet"
	@echo "${YELLOW}Please configure your rollback strategy${NC}"

version: ## Show current version
	@echo "${BLUE}Current version:${NC}"
	@cat package.json | grep version

release: ## Create release build
	@echo "${GREEN}Creating release build...${NC}"
	@make build-all
	@echo "${GREEN}Release build complete!${NC}"

# ==========================================
# Maintenance Commands
# ==========================================

update: ## Update all dependencies
	@echo "${BLUE}Updating dependencies...${NC}"
	@pnpm update --latest
	@pnpm install
	@echo "${GREEN}Dependencies updated!${NC}"

audit: ## Security audit
	@echo "${BLUE}Running security audit...${NC}"
	@pnpm audit
	@echo "${GREEN}Security audit complete!${NC}"

sizes: ## Show image sizes
	@echo "${BLUE}Docker image sizes:${NC}"
	@docker images ecommerce* --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}"

# Help target for specific commands
.PHONY: help-%
help-%:
	@sed -n 's/^$*/\t/p' $(MAKEFILE_LIST) | sed 's/##//'

# Default help
show-help:
	@make help
# ==========================================
# SEPARATED CONTAINERS - App vs Database
# ==========================================

# App-only commands (web + server)
app-build: ## Build app containers only (web + server)
	@echo "${BLUE}Building app containers (web + server)...${NC}"
	@docker compose -f docker-compose.app.yml build

app-up: ## Start app containers only
	@echo "${GREEN}Starting app containers...${NC}"
	@docker compose -f docker-compose.app.yml up -d

app-down: ## Stop app containers only
	@echo "${YELLOW}Stopping app containers...${NC}"
	@docker compose -f docker-compose.app.yml down

app-restart: ## Restart app containers only
	@echo "${YELLOW}Restarting app containers...${NC}"
	@docker compose -f docker-compose.app.yml restart

app-logs: ## View logs from app containers
	@echo "${BLUE}App logs (web + server)...${NC}"
	@docker compose -f docker-compose.app.yml logs -f

app-clean: ## Clean app containers and volumes
	@echo "${RED}Cleaning app containers...${NC}"
	@docker compose -f docker-compose.app.yml down -v --remove-orphans

# Database-only commands
db-build: ## Build/pull database container
	@echo "${BLUE}Building database container...${NC}"
	@docker compose -f docker-compose.db.yml pull postgres

db-up: ## Start database container only
	@echo "${GREEN}Starting database container...${NC}"
	@docker compose -f docker-compose.db.yml up -d

db-down: ## Stop database container only
	@echo "${YELLOW}Stopping database container...${NC}"
	@docker compose -f docker-compose.db.yml down

db-restart: ## Restart database container
	@echo "${YELLOW}Restarting database container...${NC}"
	@docker compose -f docker-compose.db.yml restart

db-logs-only: ## View database logs (standalone db container)
	@echo "${BLUE}Database logs (standalone)...${NC}"
	@docker compose -f docker-compose.db.yml logs -f postgres

db-clean: ## Clean database container and volumes (⚠️ DESTROYS DATA)
	@echo "${RED}Cleaning database container and volumes...${NC}"
	@docker compose -f docker-compose.db.yml down -v --remove-orphans
	@echo "${GREEN}Database cleaned!${NC}"

db-shell-standalone: ## Access database shell (standalone db container)
	@echo "${BLUE}Accessing PostgreSQL shell...${NC}"
	@docker compose -f docker-compose.db.yml exec postgres psql -U postgres -d ecommerce

# Combined workflow commands
# Full stack commands (existing ones updated to use separate files when needed)
all-up: ## Start full stack (db + app)
	@echo "${GREEN}Starting full stack...${NC}"
	@docker compose -f docker-compose.db.yml up -d
	@sleep 5
	@docker compose -f docker-compose.app.yml up -d

all-down: ## Stop full stack
	@echo "${YELLOW}Stopping full stack...${NC}"
	@docker compose -f docker-compose.app.yml down
	@docker compose -f docker-compose.db.yml down

all-build: ## Build all containers
	@echo "${BLUE}Building all containers...${NC}"
	@docker compose -f docker-compose.db.yml pull
	@docker compose -f docker-compose.app.yml build

all-clean: ## Clean everything
	@echo "${RED}Cleaning all containers and volumes...${NC}"
	@docker compose -f docker-compose.app.yml down -v --remove-orphans
	@docker compose -f docker-compose.db.yml down -v --remove-orphans

# Development with separate containers
dev-db: ## Start database for development
	@echo "${GREEN}Starting development database...${NC}"
	@docker compose -f docker-compose.db.yml up -d

dev-app: ## Start app containers for development
	@echo "${GREEN}Starting development app...${NC}"
	@docker compose -f docker-compose.dev.yml up

# Production with separate containers
prod-db: ## Start production database
	@echo "${GREEN}Starting production database...${NC}"
	@docker compose -f docker-compose.db.yml up -d

prod-app: ## Start production app (requires db to be running)
	@echo "${GREEN}Starting production app...${NC}"
	@docker compose -f docker-compose.app.yml up --build

# Quick commands
start-db: db-up ## Alias for db-up
stop-db: db-down ## Alias for db-down
start-app: app-up ## Alias for app-up
stop-app: app-down ## Alias for app-down
restart-db: db-restart ## Alias for db-restart
restart-app: app-restart ## Alias for app-restart

# Initialize database for first time
db-init: ## Initialize fresh database
	@echo "${BLUE}Initializing fresh database...${NC}"
	@docker compose -f docker-compose.db.yml up -d
	@sleep 10
	@echo "${GREEN}Database initialized!${NC}"
	@echo "${YELLOW}Run 'make db-migrate' to apply migrations${NC}"

# Reset everything (full wipe)
reset-all: ## Reset everything including database data
	@echo "${RED}WARNING: This will destroy ALL data including database!${NC}"
	@read -p "Are you sure? (yes/no): " confirm && [ "$$confirm" = "yes" ] || exit 1
	@docker compose -f docker-compose.app.yml down -v --remove-orphans --rmi all
	@docker compose -f docker-compose.db.yml down -v --remove-orphans
	@docker system prune -f
	@echo "${GREEN}Full reset complete!${NC}"
