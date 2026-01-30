# Production Bundle Analysis
# Add to package.json devDependencies for bundle analysis
{
  "@next/bundle-analyzer": "^15.0.0",
  "vercel-bundle-analyzer": "^0.4.1",
  "webpack-bundle-analyzer": "^4.10.2"
}

# Scripts for bundle analysis
{
  "analyze:web": "ANALYZE=true bun run build:web",
  "analyze:server": "bun run build:server && cd apps/server && npx webpack-bundle-analyzer dist/"
}