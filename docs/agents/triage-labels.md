# Triage Labels

This repository uses the **default canonical triage labels** (five roles).

## Label Mapping

| Canonical Role | GitHub Label | Description |
|----------------|--------------|-------------|
| `needs-triage` | `needs-triage` | New issue, not yet reviewed |
| `needs-info` | `needs-info` | Awaiting clarification from reporter |
| `ready-for-agent` | `ready-for-agent` | Spec complete, ready for AI implementation |
| `ready-for-human` | `ready-for-human` | Requires human decision/action |
| `wontfix` | `wontfix` | Closed without action |

## Creating Missing Labels

Run this to ensure all labels exist in GitHub:

```bash
gh label create "needs-triage" --color "F9D0C4" --description "New issue, not yet reviewed" 2>/dev/null || true
gh label create "needs-info" --color "FEF2C0" --description "Awaiting clarification from reporter" 2>/dev/null || true
gh label create "ready-for-agent" --color "BFDADC" --description "Spec complete, ready for AI implementation" 2>/dev/null || true
gh label create "ready-for-human" --color "D4C5F9" --description "Requires human decision/action" 2>/dev/null || true
gh label create "wontfix" --color "FFFFFF" --description "Closed without action" 2>/dev/null || true
```

## Override Note

If your team uses different label names (e.g., `bug:triage` instead of `needs-triage`), edit this file to map the canonical roles to your existing labels. The `triage` skill reads this file to know which labels to apply.