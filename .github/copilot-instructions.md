# GitHub Copilot custom instructions — p2pui_v1

## Unit test & coverage requirements

- Maintain **≥ 90% unit-test coverage per file** for statements, branches, functions, and lines across all application TypeScript under `src/` (no skipped files).
- When editing application code, always update or add matching `*.spec.ts` coverage.
- Respect the **60s global Jasmine timeout** configured in `karma.conf.js`.
- After changes, run:

```bash
npm run lint
npm run typecheck
npm run test:coverage
npm run coverage:check
```

- `coverage:check` must pass; it fails the build if any file is below 90% on any metric.
- Prefer mocks for `HttpClient`, Router, NgBootstrap modals, and browser-only APIs.
- Do not disable, skip (`xit`/`xdescribe`), or exclude source files to greenwash coverage.
- PR workflow posts overall test pass/fail counts and overall + per-file coverage summaries.
