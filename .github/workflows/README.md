# CI/CD Pipeline Documentation

This document describes the GitHub Actions workflows configured for this project.

## Overview

The project uses a comprehensive CI/CD pipeline with multiple workflows for different purposes:

1. **CI/CD Pipeline** (`ci-cd.yml`) - Main continuous integration and deployment
2. **PR Checks** (`pr-checks.yml`) - Pull request validation
3. **Scheduled Maintenance** (`scheduled.yml`) - Automated maintenance tasks
4. **Release** (`release.yml`) - Release management
5. **Deploy** (`deploy.yml`) - Manual deployment workflow

## Workflows

### 1. CI/CD Pipeline

**Trigger:** Push to `main` or `develop`, pull requests, manual dispatch

**Jobs:**

- **Quality Checks**: Runs linting, type checking, and format checking
- **Security Scan**: Runs dependency audit and Trivy vulnerability scanning
- **Build Docker**: Builds and pushes Docker images to GitHub Container Registry
- **Integration Tests**: Runs integration tests with a test database
- **Deploy Staging**: Deploys to staging environment (develop branch)
- **Deploy Production**: Deploys to production environment (main branch)

**Docker Images:**

- `ghcr.io/<owner>/<repo>-web`
- `ghcr.io/<owner>/<repo>-server`

### 2. PR Checks

**Trigger:** Pull requests to `main` or `develop`

**Jobs:**

- **Check Size**: Warns if PR is too large
- **Check Commits**: Validates conventional commit format
- **Lint Dockerfile**: Validates Dockerfile using Hadolint
- **Validate Compose**: Validates Docker Compose files
- **Detect Secrets**: Scans for leaked secrets using GitLeaks and TruffleHog

### 3. Scheduled Maintenance

**Trigger:** Weekly on Sundays at 2 AM UTC, manual dispatch

**Jobs:**

- **Check Updates**: Checks for outdated dependencies
- **Security Audit**: Runs comprehensive security audit
- **Check Base Images**: Checks for Docker base image updates
- **Cleanup**: Removes old workflow runs and container images

### 4. Release

**Trigger:** Push of version tags (v\*), manual dispatch

**Jobs:**

- **Create Release**: Generates release notes and creates GitHub release
- **Build Production**: Builds and pushes production images with version tags
- **Deploy Production**: Deploys to production environment
- **Notifications**: Sends Slack notifications on success/failure

### 5. Deploy

**Trigger:** Manual dispatch only

**Parameters:**

- Environment: staging or production
- Version: Image tag to deploy

**Process:**

1. Pulls specified image versions
2. Deploys via SSH to target server
3. Runs database migrations
4. Performs health checks
5. Automatic rollback on failure

## Required Secrets

Configure these secrets in your GitHub repository settings:

### For CI/CD

- `GITHUB_TOKEN`: Automatically provided by GitHub

### For Deployment

- `SSH_PRIVATE_KEY`: SSH key for server access
- `SSH_HOST`: Target server hostname/IP
- `SSH_USER`: SSH username

### For Notifications (Optional)

- `SLACK_WEBHOOK_URL`: Slack webhook for notifications

### For Environment Variables

Configure these in your repository's Environment settings:

**Staging Environment:**

- `ENVIRONMENT_URL`: Staging application URL

**Production Environment:**

- `ENVIRONMENT_URL`: Production application URL

## Usage

### Making a Release

1. Create and push a version tag:

   ```bash
   git tag -a v1.0.0 -m "Release version 1.0.0"
   git push origin v1.0.0
   ```

2. The Release workflow will automatically:
   - Generate release notes
   - Build production images
   - Deploy to production
   - Send notifications

### Manual Deployment

1. Go to Actions tab in GitHub
2. Select "Deploy" workflow
3. Click "Run workflow"
4. Select environment and version
5. Click "Run workflow"

### Checking PR Status

All PRs automatically run:

- Code quality checks
- Security scans
- Dockerfile linting
- Secret detection

Checks must pass before merging is allowed.

## Docker Image Tags

Images are tagged with:

- `latest` - Always points to the most recent main branch build
- `main` - Latest build from main branch
- `develop` - Latest build from develop branch
- `sha-<commit>` - Specific commit hash
- `v<version>` - Release versions

## Security Features

- **Trivy Scanning**: Scans container images for vulnerabilities
- **Secret Detection**: Prevents accidental secret commits
- **Dependency Audit**: Checks for known vulnerabilities
- **SBOM Generation**: Creates software bill of materials
- **Image Signing**: Signs container images with Cosign

## Best Practices

1. **Always use specific versions** in production deployments
2. **Review security scan results** before deploying
3. **Keep dependencies updated** based on scheduled checks
4. **Monitor deployment notifications** for quick issue response
5. **Use conventional commits** for automatic release notes

## Troubleshooting

### Build Failures

1. Check the workflow logs in GitHub Actions
2. Verify Dockerfile syntax with `make lint-dockerfile`
3. Test locally with `make build`

### Deployment Failures

1. Verify SSH credentials are configured correctly
2. Check target server is accessible
3. Review deployment logs via SSH
4. Use automatic rollback if needed

### Image Pull Failures

1. Verify GitHub token has package read permissions
2. Check image exists in GitHub Container Registry
3. Verify image tag is correct
