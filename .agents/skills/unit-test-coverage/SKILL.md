---
name: unit-test-coverage
description: Skill for measuring and enforcing 90% per-file coverage in p2pui_v1.
---

# Unit test coverage skill

## When to use

Any time application TypeScript under `src/` changes, or when asked to improve coverage / fix CI quality failures.

## Steps

1. Identify changed or under-covered files via `npm run coverage:check` (or the last `coverage/coverage-check-summary.json`).
2. Add or extend `*.spec.ts` beside each source file. Exercise branches and error paths.
3. Run:

```bash
npm run test:coverage
npm run coverage:check
```

4. Do not stop while any file is below 90% on statements, branches, functions, or lines.
5. Paste overall + per-file coverage into the final response.
