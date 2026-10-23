# Issue Tracker: GitHub Issues

This repository uses **GitHub Issues** as its issue tracker.

## Configuration

- **Remote**: `origin` → `git@github.com:imanpr33trai/ecommerce_practice.git`
- **CLI**: `gh` (GitHub CLI)
- **PRs as request surface**: `false` (external PRs are not auto-triaged)

## Usage

Skills that interact with issues (`to-tickets`, `triage`, `to-spec`, etc.) will:
- Read issues via `gh issue list`, `gh issue view`
- Create issues via `gh issue create`
- Update issues via `gh issue edit`
- Comment via `gh issue comment`

## Label Management

Labels are managed in `docs/agents/triage-labels.md`. Run `gh label create` for any missing labels before using the `triage` skill.