# Quality Check Configuration & Assistant Instructions (Gemini & Antigravity)

This document defines the mandatory Quality Check protocol for AI coding agents operating on this Angular workspace (`p2pui_v1_qua`), including Antigravity, Gemini, Kiro, Claude, Cursor, and OpenAI Codex.

---

## Mandatory 90% Per-File Unit Test Code Coverage Benchmark

- **Strict 90% Unit Test Code Coverage Each File Wise**: Every single application TypeScript file under `src/` (excluding `*.spec.ts`, `*.d.ts`, and `test.ts`) MUST achieve at least **90% coverage across ALL parameters**:
  1. **Statements** (minimum 90.00%)
  2. **Branches** (minimum 90.00%)
  3. **Functions** (minimum 90.00%)
  4. **Lines** (minimum 90.00%)
- **Zero Exemptions**: Do NOT skip or exclude any source file. All application components, services, pipes, directives, and models must reach $\ge 90\%$ on all 4 metrics.
- **Enforcement on Failure**: `npm run coverage:check` enforces `threshold: 90`. If any metric on any file is below 90%, it throws an error and exits with code 1.
- **Global Test Timeout**: All unit tests must execute under the configured global timeout of **60 seconds** (`jasmine.timeoutInterval: 60000` in `karma.conf.js`).
- **Mandatory Verification on Every Change**: Whenever making ANY code change, AI agents MUST execute the unit test coverage suite and verify that all coverage metrics pass without skipping any file.

---

## Mandatory Quality Check Commands

```bash
npm run lint
npm run typecheck
npm run build -- --configuration=development
npm run test:coverage
npm run coverage:check
```

Shortcut:
```bash
npm run quality
```
