# Vercel Deployment Optimizations for pnpm + Node.js

## Overview
This document outlines Vercel-specific optimizations for the migrated monorepo running on pnpm workspaces and Node.js runtime.

## Deployment Configuration Optimizations

### 1. Build Optimization

#### 1.1 Web App (Next.js) Optimizations
```json
{
  "buildCommand": "cd ../../ && pnpm run build:web",
  "outputDirectory": ".next",
  "installCommand": "cd ../../ && pnpm install --frozen-lockfile",
  "functions": {
    "apps/web/pages/api/**/*.ts": {
      "runtime": "nodejs20.x",
      "maxDuration": 30
    }
  }
}
```

#### 1.2 Server App (Hono) Optimizations
```json
{
  "buildCommand": "cd ../../ && pnpm run build:server",
  "outputDirectory": "dist",
  "installCommand": "cd ../../ && pnpm install --frozen-lockfile",
  "functions": {
    "src/index.ts": {
      "runtime": "nodejs20.x",
      "maxDuration": 30,
      "memory": 1024
    }
  }
}
```

### 2. Caching Strategies

#### 2.1 Static Asset Caching
```json
{
  "headers": [
    {
      "source": "/_next/static/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/images/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

#### 2.2 API Response Caching
```json
{
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "s-maxage=300, stale-while-revalidate=600"
        }
      ]
    }
  ]
}
```

### 3. Security Headers

#### 3.1 Comprehensive Security Configuration
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Permissions-Policy",
          "value": "camera=(), microphone=(), geolocation=()"
        },
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=31536000; includeSubDomains; preload"
        }
      ]
    }
  ]
}
```

### 4. Environment Optimization

#### 4.1 Node.js Runtime Optimization
```json
{
  "functions": {
    "src/**/*.ts": {
      "runtime": "nodejs20.x",
      "maxDuration": 30,
      "memory": 1024,
      "includeFiles": "dist/**"
    }
  }
}
```

#### 4.2 Environment Variables Configuration
```bash
# Production Environment Variables
NEXT_PUBLIC_API_SERVER_URL=https://your-server.vercel.app
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1

# Development Environment Variables
NODE_ENV=development
NEXT_PUBLIC_API_SERVER_URL=http://localhost:3002
```

## Build Performance Optimizations

### 1. pnpm Optimizations

#### 1.1 Lockfile Optimization
```yaml
# pnpm-workspace.yaml
link-workspace-packages: true
prefer-workspace-packages: true
node-linker: isolated
```

#### 1.2 Install Optimization
```json
{
  "scripts": {
    "install:ci": "pnpm install --frozen-lockfile --prod=false",
    "install:prod": "pnpm install --frozen-lockfile --prod"
  }
}
```

### 2. TypeScript Compilation Optimization

#### 2.1 Incremental Compilation
```json
{
  "compilerOptions": {
    "incremental": true,
    "tsBuildInfoFile": ".next/cache/tsbuildinfo.json"
  }
}
```

#### 2.2 Parallel Type Checking
```json
{
  "scripts": {
    "type-check": "tsc --noEmit --project tsconfig.json",
    "type-check:parallel": "pnpm -r --parallel run type-check"
  }
}
```

### 3. Bundle Size Optimization

#### 3.1 Next.js Optimization
```javascript
// next.config.ts
const nextConfig = {
  experimental: {
    optimizePackageImports: ['@workspace/ui'],
    serverComponentsExternalPackages: ['pg'],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  swcMinify: true,
  poweredByHeader: false,
  compress: true,
};

export default nextConfig;
```

#### 3.2 Tree Shaking Optimization
```javascript
// Optimization for imports
import { Button } from '@workspace/ui/button';
// Instead of: import { Button } from '@workspace/ui';
```

## Database Optimization

### 1. Connection Pooling

#### 1.1 Prisma Configuration
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  // Connection pooling for serverless
  directUrl = env("DIRECT_DATABASE_URL")
}
```

#### 1.2 Connection Optimization
```typescript
// Database connection optimization for serverless
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  // Enable connection pooling for serverless
  __internal: {
    engine: {
      // Reduce connection timeout
      connectTimeout: 5000,
    },
  },
});
```

### 2. Query Optimization

#### 2.1 Caching Strategy
```typescript
// API response caching
app.get('/api/products', async (c) => {
  const cacheKey = 'products:list';
  const cached = await cache.get(cacheKey);
  
  if (cached) {
    return c.json(cached);
  }
  
  const products = await prisma.product.findMany({
    include: {
      category: true,
      images: true,
    },
  });
  
  await cache.set(cacheKey, products, 300); // 5 minutes
  return c.json(products);
});
```

## Monitoring and Analytics

### 1. Performance Monitoring

#### 1.1 Core Web Vitals
```javascript
// next.config.ts
const nextConfig = {
  experimental: {
    instrumentationHook: true,
  },
};

// lib/monitoring.ts
export function reportWebVitals(metric: any) {
  // Send to Vercel Analytics or custom service
  if (process.env.NODE_ENV === 'production') {
    // Analytics implementation
  }
}
```

#### 1.2 Error Tracking
```typescript
// Error boundary implementation
export class ErrorBoundary extends Component {
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log to Vercel or external service
    console.error('Error caught by boundary:', error, errorInfo);
  }
}
```

### 2. Health Checks

#### 2.1 Web App Health Check
```typescript
// pages/api/health.ts
export default function handler(req: NextRequest, res: NextResponse) {
  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version,
    environment: process.env.NODE_ENV,
  });
}
```

#### 2.2 Server Health Check
```typescript
// src/routes/health.ts
app.get('/health', async (c) => {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    
    return c.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
      environment: process.env.NODE_ENV,
    });
  } catch (error) {
    return c.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Database connection failed',
    }, 500);
  }
});
```

## Deployment Strategy

### 1. Preview Deployments

#### 1.1 Automatic Preview for PRs
```yaml
# .github/workflows/vercel-deploy-pnpm.yml
- name: Deploy to Vercel Preview
  uses: amondnet/vercel-action@v25
  with:
    vercel-token: ${{ secrets.VERCEL_TOKEN }}
    vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
    vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
    working-directory: apps/web
    vercel-args: '--confirm'
```

#### 1.2 Environment-Specific Configurations
```json
{
  "build": {
    "env": {
      "VERCEL_ENV": "preview"
    }
  }
}
```

### 2. Production Deployments

#### 2.1 Zero-Downtime Deployment
```bash
# Gradual rollout strategy
vercel --prod --scope=your-team
vercel alias set your-app.vercel.app your-domain.com
```

#### 2.2 Rollback Strategy
```bash
# Quick rollback command
vercel rollback your-app.vercel.app
```

## Cost Optimization

### 1. Bundle Size Reduction

#### 1.1 Dynamic Imports
```typescript
// Lazy load heavy components
const AdminDashboard = dynamic(() => import('../components/AdminDashboard'), {
  loading: () => <div>Loading...</div>,
  ssr: false,
});
```

#### 1.2 Code Splitting
```javascript
// Optimize chunk splitting
const nextConfig = {
  experimental: {
    optimizePackageImports: ['@workspace/ui'],
  },
  webpack: (config) => {
    config.optimization.splitChunks = {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    };
    return config;
  },
};
```

### 2. Serverless Optimization

#### 2.1 Cold Start Reduction
```typescript
// Initialize outside function scope
const prisma = new PrismaClient();

app.get('/api/products', async (c) => {
  // Reuse connection
  const products = await prisma.product.findMany();
  return c.json(products);
});
```

#### 2.2 Memory Optimization
```typescript
// Stream large responses
app.get('/api/export', async (c) => {
  const stream = await generateCSVStream();
  return c.newResponse(stream, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="export.csv"',
    },
  });
});
```

## Conclusion

These optimizations ensure that your migrated monorepo performs optimally on Vercel's platform while taking advantage of pnpm's efficiency and Node.js's mature ecosystem. Regular monitoring and incremental improvements will help maintain high performance as your application scales.
