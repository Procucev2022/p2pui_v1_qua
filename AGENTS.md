# Agent instructions — p2pui_v1 (Angular)

Read this file before changing application code.

## Coverage contract (mandatory)

- Every application TypeScript file under `src/` (excluding `*.spec.ts`, `*.d.ts`, and `test.ts`) must reach **≥ 90%** coverage on **all** of:
  - statements
  - branches
  - functions
  - lines
- **Do not skip any file.** Missing instrumentation counts as 0% and fails the gate.
- Never lower thresholds or add exclusions to hide untested application behavior.
- Global unit-test timeout is **60 seconds** (`jasmine.timeoutInterval` in `karma.conf.js`).

## Required commands after any code change

```bash
npm run lint
npm run typecheck
npm run build -- --configuration=development
npm run test:coverage
npm run coverage:check
```

`npm run coverage:check` prints **overall** and **per-file** coverage for every source file and exits non-zero if any metric on any file is below 90%.

## Testing rules

- Prefer deterministic Jasmine/Karma unit tests.
- Mock HTTP, routers, dialogs, and external browser APIs.
- When you change a file, update or add its `*.spec.ts` so the per-file gate still passes.
- Include the full `coverage:check` output in the completion report.

## CI

Pull requests run `.github/workflows/pr-quality.yml` (lint, typecheck, build, tests, 90% per-file coverage, PR summary comment).
