# Step-by-Step Migration Commands

## Phase 1: Preparation

### 1.1 Create Backup Branch
```bash
git checkout main
git pull origin main
git checkout -b migration/pnpm-nodejs-migration
git add .
git commit -m "Pre-migration: Current Turborepo + Bun state"
```

### 1.2 Document Current State
```bash
# List current dependencies
bun pm ls > current-dependencies.txt

# Test current build
bun run build

# Test current deployment
bun run deploy:preview
```

## Phase 2: Package Manager Migration

### 2.1 Install pnpm
```bash
# Install pnpm globally
npm install -g pnpm@9.15.4

# Verify installation
pnpm --version
```

### 2.2 Backup and Install Dependencies
```bash
# Backup current lockfiles
cp bun.lockb bun.lockb.backup 2>/dev/null || true

# Remove existing node_modules
rm -rf node_modules apps/*/node_modules packages/*/node_modules

# Install with pnpm
pnpm install
```

### 2.3 Update Root Package.json
```bash
# Replace root package.json
cp package.json.new package.json

# Commit changes
git add package.json
git commit -m "Update root package.json for pnpm migration"
```

### 2.4 Create Workspace Configuration
```bash
# Create pnpm workspace config
git add pnpm-workspace.yaml
git commit -m "Add pnpm workspace configuration"
```

## Phase 3: Application Package Updates

### 3.1 Update Web Application
```bash
# Replace web package.json
cp apps/web/package.json.new apps/web/package.json

# Update Vercel config
cp apps/web/vercel.json.new apps/web/vercel.json

# Commit changes
git add apps/web/package.json apps/web/vercel.json
git commit -m "Update web application for pnpm and Node.js"
```

### 3.2 Update Server Application
```bash
# Replace server package.json
cp apps/server/package.json.new apps/server/package.json

# Create Vercel config for server
git add apps/server/package.json apps/server/vercel.json
git commit -m "Update server application for pnpm and Node.js"
```

### 3.3 Update Package Dependencies
```bash
# Update all package package.json files to remove Bun references
# (Manual step - review each package for Bun-specific dependencies)

# Install updated dependencies
pnpm install

# Commit package updates
git add packages/*/package.json
git commit -m "Update internal packages for pnpm compatibility"
```

## Phase 4: Script Updates

### 4.1 Update Deployment Scripts
```bash
# Replace deployment script
cp scripts/deploy-pnpm.sh scripts/deploy.sh

# Make executable
chmod +x scripts/deploy.sh

# Commit changes
git add scripts/deploy.sh
git commit -m "Update deployment script for pnpm"
```

### 4.2 Update CI/CD Workflow
```bash
# Replace GitHub Actions workflow
git add .github/workflows/vercel-deploy-pnpm.yml
git commit -m "Update GitHub Actions workflow for pnpm"
```

## Phase 5: Testing

### 5.1 Local Development Testing
```bash
# Test dependency installation
pnpm install

# Test build processes
pnpm run build

# Test type checking
pnpm run type-check

# Test linting
pnpm run lint

# Test development servers
pnpm run dev

# Test individual app development
pnpm run dev:web
pnpm run dev:server
```

### 5.2 Database Testing
```bash
# Test database operations
pnpm run db:generate
pnpm run db:migrate
pnpm run db:studio
```

### 5.3 Build Testing
```bash
# Test individual app builds
pnpm run build:web
pnpm run build:server

# Test parallel builds
pnpm -r --parallel run build
```

## Phase 6: Deployment Testing

### 6.1 Preview Deployment
```bash
# Test preview deployment
pnpm run deploy:preview

# Monitor deployment
vercel ls
```

### 6.2 Production Deployment (When Ready)
```bash
# Deploy to production
pnpm run deploy:all

# Health checks
curl https://your-app.vercel.app/health
curl https://your-server.vercel.app/health
```

## Phase 7: Cleanup

### 7.1 Remove Old Configuration
```bash
# Remove Turborepo configuration (if exists)
rm -f turbo.json

# Remove Bun lockfiles
rm -f bun.lockb bun.lockb.backup

# Remove Bun-related dependencies from packages
# (Manual step - review each package.json for @types/bun, etc.)

# Commit cleanup
git add -A
git commit -m "Clean up old Turborepo and Bun configuration"
```

### 7.2 Update Documentation
```bash
# Update README with new commands
# Update package.json scripts documentation
# Update development workflow documentation
```

## Phase 8: Merge and Rollout

### 8.1 Final Testing
```bash
# Full integration test
pnpm run clean:build
pnpm run install
pnpm run build
pnpm run test  # if tests exist

# Final deployment test
pnpm run deploy:preview
```

### 8.2 Merge to Main
```bash
# Switch to main branch
git checkout main
git pull origin main

# Merge migration branch
git merge migration/pnpm-nodejs-migration

# Push to main
git push origin main

# Deploy to production
pnpm run deploy:all
```

## Troubleshooting Commands

### Dependency Issues
```bash
# Clear pnpm cache
pnpm store prune

# Fresh install
pnpm run clean:deps
pnpm install

# Check for conflicts
pnpm why <package-name>
```

### Build Issues
```bash
# Clear build artifacts
pnpm run clean:build

# Rebuild everything
pnpm run build

# Check TypeScript configuration
pnpm run type-check
```

### Deployment Issues
```bash
# Check Vercel configuration
vercel whoami
vercel ls

# Local deployment test
cd apps/web && vercel --local
cd apps/server && vercel --local
```

### Performance Issues
```bash
# Analyze bundle sizes
pnpm --filter web run analyze  # if analyze script exists

# Check build times
time pnpm run build

# Monitor memory usage
node --max-old-space-size=4096 node_modules/.bin/next build
```
