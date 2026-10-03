# AI Coding Agents Instructions — p2pui_v1 (Angular)

This document defines the mandatory Quality Check & Code Coverage protocol for AI coding agents operating on this repository (including Antigravity, Cursor, Claude, OpenAI Codex, Kiro, and others).

Read this file before making any changes to application code.

---

## 1. Mandatory 90% Per-File Unit Test Code Coverage Benchmark

- **Strict 90% Unit Test Code Coverage Each File Wise**: Every single application TypeScript file under `src/` (excluding `*.spec.ts`, `*.d.ts`, and `test.ts`) **MUST** achieve at least **90% coverage across ALL parameters**:
  1. **Statements** (minimum 90.00%)
  2. **Branches** (minimum 90.00%)
  3. **Functions** (minimum 90.00%)
  4. **Lines** (minimum 90.00%)
- **Zero Exemptions / Do Not Skip Any File**: Every file in `src/` must be tested. Missing instrumentation counts as 0% and immediately fails the gate. Never lower thresholds, never add exclusions, and never skip files to hide untested application behavior.
- **Enforcement on Failure**: In case per-file unit test coverage falls below 90% across ANY parameter (statements, branches, functions, lines) for any file, the coverage verification script (`npm run coverage:check`) **MUST throw an error and exit with code 1**, blocking the build/PR.
- **Global Test Timeout**: All unit tests must execute under the configured global timeout of **60 seconds** (`jasmine.timeoutInterval: 60000` in `karma.conf.js`).

---

## 2. Mandatory Quality Check Protocol on Every Change

Whenever making **ANY** change (features, bug fixes, refactoring, or UI enhancements), AI coding agents **MUST** execute the following verification pipeline before declaring the task completed:

```bash
# 1. Lint and Static Analysis
npm run lint

# 2. Typecheck (No compilation errors)
npm run typecheck

# 3. Development Build Check
npm run build -- --configuration=development

# 4. Execute Full Unit Test Suite with Code Coverage
npm run test:coverage

# 5. Enforce 90% Per-File Coverage Gate Across All Parameters
npm run coverage:check
```

Shortcut command:
```bash
npm run quality
```

---

## 3. Unit Test Development Guidelines

- **Always Add Unit Tests with Code Changes**: Apart from modifying production code, AI agents **MUST** simultaneously add or update unit tests (`*.spec.ts`) for every modified file to achieve $\ge 90\%$ on all counters.
- **Deterministic Tests**: Write isolated, deterministic Jasmine/Karma unit tests.
- **Mock External Dependencies**: Always mock HTTP calls (`HttpClientTestingModule`, `HttpTestingController`), Angular Router, Material Dialogs (`MatDialogRef`, `MAT_DIALOG_DATA`), and browser APIs (`localStorage`, `ClipboardEvent`).
- **Comprehensive Coverage**: Cover all conditionals, edge branches (e.g., null, empty strings, undefined, arrays vs. objects), error callbacks, and observable completion streams.
- **Final Report Requirement**: In the completion report, always print the overall coverage summary and confirm that all files passed the per-file 90% gate without skipping any file.
