# Production Build and Deployment Plan

## Overview
This plan outlines the production build and deployment strategy for a monorepo with two separate Vercel projects: a Next.js web app and a Hono/Bun server API.

## Architecture

### Projects
1. **Web App** (`apps/web`): Next.js with TypeScript
2. **Server API** (`apps/server`): Hono/Bun with TypeScript
3. **Shared Packages**: UI, Auth, API, DB, Env, Config

### Deployment Targets
- **Web App**: `https://your-app.vercel.app`
- **Server API**: `https://your-server.vercel.app`

## Configuration Files Created

### 1. Web App Configuration (`apps/web/`)
- `vercel.json`: Vercel deployment configuration with security headers
- `next.config.ts`: Optimized Next.js configuration with performance enhancements

### 2. Server Configuration (`apps/server/`)
- `vercel.json`: Vercel deployment configuration for Hono
- Enhanced `src/index.ts`: Production-ready server with security middleware
- `src/middleware/`: Rate limiting, error handling, and database middleware

### 3. CI/CD Pipeline
- `.github/workflows/vercel-deploy.yml`: GitHub Actions workflow for automated deployments
- `scripts/deploy.sh`: Manual deployment script

### 4. Environment Configuration
- `.env.production.example`: Production environment variables template
- `.env.development.example`: Development environment variables template

## Key Optimizations

### Performance
- Bundle size optimization with tree shaking
- Image optimization with WebP/AVIF formats
- Static asset caching strategies
- Server-side rendering optimization

### Security
- Security headers (CSP, HSTS, XSS Protection)
- CORS configuration
- Rate limiting
- Input validation
- Environment variable security

### Monitoring
- Health check endpoints
- Error tracking integration
- Performance monitoring setup
- Log management

## Deployment Process

### Automated (CI/CD)
1. Push to `main` or `develop` branches
2. GitHub Actions detects changes
3. Runs type checking, linting, and tests
4. Builds affected projects
5. Deploys to appropriate Vercel environment
6. Runs health checks

### Manual
```bash
# Deploy both projects
./scripts/deploy.sh all production

# Deploy only web app
./scripts/deploy.sh web production

# Deploy only server
./scripts/deploy.sh server production
```

## Environment Variables

### Required for Production
- `DATABASE_URL`: PostgreSQL connection string
- `NEXT_PUBLIC_API_SERVER_URL`: Server API URL
- `NEXTAUTH_SECRET`: Authentication secret
- `JWT_SECRET`: JWT signing secret
- `CORS_ORIGIN`: Allowed CORS origins
- `VERCEL_TOKEN`: Vercel deployment token (web)
- `VERCEL_SERVER_TOKEN`: Vercel deployment token (server)

### Optional
- `SENTRY_DSN`: Error tracking
- `REDIS_URL`: Caching layer
- `UPLOADTHING_SECRET`: File upload service

## Database Configuration

### PostgreSQL Setup
- Use Vercel Postgres or external PostgreSQL provider
- Configure connection pooling for serverless
- Enable SSL connections
- Set up read replicas for scaling

### Prisma Configuration
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  // Connection pooling for serverless
  directUrl = env("DIRECT_DATABASE_URL")
}
```

## Security Checklist

### Headers Applied
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy`: Restricted access
- `Strict-Transport-Security`: HSTS enabled
- `X-XSS-Protection: 1; mode=block`

### CORS Configuration
- Strict origin policy
- Credentials allowed
- Specific headers only
- Environment-based origins

## Performance Optimization

### Next.js Optimizations
- React Compiler enabled
- SWC minification
- CSS optimization
- Image optimization
- Bundle analysis

### Server Optimizations
- Connection pooling
- Response caching
- Compression
- Edge functions support

## Monitoring and Maintenance

### Health Checks
- Web App: `/health` endpoint
- Server API: `/api/health` endpoint
- Database connectivity checks

### Error Tracking
- Sentry integration for error monitoring
- Custom error handlers
- Log aggregation

### Performance Monitoring
- Vercel Analytics
- Core Web Vitals tracking
- Bundle size monitoring

## Scaling Considerations

### Web App
- ISR for dynamic content
- Edge caching strategies
- CDN utilization
- Incremental Static Regeneration

### Server API
- Serverless auto-scaling
- Database connection pooling
- Response caching
- Edge function deployment

## Troubleshooting

### Common Issues
1. **Build Failures**: Check environment variables and dependencies
2. **CORS Errors**: Verify CORS origins configuration
3. **Database Connection**: Check connection string and SSL settings
4. **Deployment Failures**: Verify Vercel tokens and project configuration

### Debug Commands
```bash
# Check build locally
bun run build:web
bun run build:server

# Test environment variables
bun run db:migrate

# Verify deployment
vercel ls
```

## Next Steps

1. Set up Vercel projects and obtain deployment tokens
2. Configure PostgreSQL database
3. Set up environment variables in Vercel dashboard
4. Configure GitHub Actions secrets
5. Test deployment workflow
6. Set up monitoring and alerting
7. Configure custom domains
8. Set up backup and disaster recovery

This deployment plan provides a comprehensive, production-ready setup with security, performance, and scalability considerations built-in.