# p2pui_v1 — Quality Gate & Unit Test Coverage Documentation

**Project:** `p2pui_v1` (Angular 16 — `p2pui-gmtbfs`)  
**Branch context:** `ci-cd/pipeline`  
**Date:** 12 Aug 2026  
**Status:** Configuration & CI complete · Full 90% per-file coverage **not yet achieved** for all application files

---

## 1. Task summary

| Requirement | Status |
|---|---|
| GitHub Actions workflow on pull requests | ✅ Done |
| Lint + typecheck + build in CI | ✅ Done |
| Unit tests in CI with coverage | ✅ Done |
| 90% coverage threshold (statements, branches, functions, lines) **per file** | ✅ Configured (gate fails if below) |
| PR comment with test + coverage summary | ✅ Done |
| Global unit-test timeout (60s) | ✅ Done |
| Copilot / Cursor / Antigravity agent instructions | ✅ Done |
| Achieve 90% coverage across **every** application file | ⚠️ **In progress** (services largely deepened; most components still stubs) |

---

## 2. GitHub Actions — what was covered

### New workflow
**File:** `.github/workflows/pr-quality.yml`

**Triggers:** `pull_request` (`opened`, `synchronize`, `reopened`, `ready_for_review`)

**Pipeline steps:**
1. Checkout
2. Setup Node.js 20 + npm cache
3. `npm ci --legacy-peer-deps`
4. Setup Chrome (`browser-actions/setup-chrome`)
5. **Lint** — `npm run lint`
6. **Typecheck** — `npm run typecheck`
7. **Build** — `npm run build -- --configuration=development`
8. **Unit tests + coverage** — `npm run test:coverage`
9. **Per-file 90% gate** — `npm run coverage:check`
10. Build PR markdown summary — `npm run test:summary`
11. Upload `coverage/**` artifact
12. Post / update PR comment with:
    - total / passed / failed / errors / skipped tests
    - overall coverage (statements, branches, functions, lines)
    - per-file 90% gate status + failing files

**Existing deploy workflows (unchanged):**
- `.github/workflows/main_p2pv1dev.yml`
- `.github/workflows/prodmaster_qua.yml`

---

## 3. Unit test / coverage configuration — what was covered

### Karma
**File:** `karma.conf.js`

- Jasmine **global timeout:** `60000` ms
- Headless browser: `ChromeHeadlessNoSandbox`
- Coverage reporters: `html`, `text`, `text-summary`, `lcovonly`, `json`, `json-summary`, `cobertura`
- JUnit reporter for PR summaries: `coverage/junit/test-results.xml`
- Istanbul thresholds (**fail on error**, not warning):
  - **Global:** statements / branches / functions / lines ≥ **90%**
  - **Each file:** statements / branches / functions / lines ≥ **90%**
- `includeAllSources: true`
- CI timeouts: `browserNoActivityTimeout` / `browserDisconnectTimeout` / `captureTimeout`

### Angular test target
**File:** `angular.json` → `architect.test`

- `karmaConfig: karma.conf.js`
- `codeCoverage: true`

### NPM scripts (`package.json`)

| Script | Purpose |
|---|---|
| `lint` | TSLint over app sources |
| `typecheck` | `tsc --noEmit` |
| `test` | Interactive Karma (auto-resolves Chrome/Edge) |
| `test:ci` / `test:coverage` | Headless single-run + coverage |
| `coverage:check` | Per-file 90% gate over **all** `src/**/*.ts` (no skips of app files) |
| `test:summary` | Builds `coverage/pr-comment.md` |
| `quality` | Full local quality gate |

### Helper scripts

| File | Purpose |
|---|---|
| `scripts/check-coverage.js` | Reads Istanbul JSON; prints **overall + every file**; fails if any metric &lt; 90% |
| `scripts/summarize-test-results.js` | Builds PR comment markdown from JUnit + coverage |
| `scripts/with-chrome.js` | Resolves Chrome/Edge binary for local Windows/macOS/Linux |
| `scripts/gen-http-service-spec.js` | Helper used while generating HTTP service specs |

---

## 4. Agent / AI instructions — what was covered

| File | Purpose |
|---|---|
| `AGENTS.md` | Repo agent contract: 90% per-file, 60s timeout, required commands |
| `.cursorrules` | Cursor always-on coverage rules |
| `.cursor/rules/unit-test-coverage.mdc` | Cursor rule (always apply) |
| `.github/copilot-instructions.md` | GitHub Copilot custom instructions |
| `.agents/agents/unit-test-coverage-guardian/agent.md` | Antigravity custom agent |
| `.agents/skills/unit-test-coverage/SKILL.md` | Antigravity skill for coverage work |

---

## 5. Unit tests deepened / added (coverage work done so far)

### 5.1 Config / environment / animations
- `src/environments/environment.spec.ts`
- `src/environments/environment.prod.spec.ts`
- `src/app/app.config.spec.ts`
- `src/app/router.animations.spec.ts`
- `src/app/shared/constants/app-api.config.spec.ts`

### 5.2 Routing modules (~22 specs)
Specs added/updated for major `*-routing.module.ts` files (app, login, signup, layout, bfs, category, category-mgr, client, configurations, dashboard, invoices, pos, ppos, vendor, vendor-mgr, vendor-registration, common-share, etc.).

### 5.3 Shared services / interceptors / guards / directives / validations
Deepened (multi-assertion) examples:
- `authentication.service.spec.ts` (~37 tests) — includes `AuthPageReload` test seam for reload branches
- `encry-decry.service.spec.ts`
- `form-validatations.service.spec.ts`
- `custom-validations.service.spec.ts`
- `loader.service.spec.ts` (+ common-share loader)
- `loader.interceptor.spec.ts` (shared + common-share)
- `request.interceptor.spec.ts`
- `auth.guard.spec.ts`
- `screen-access-guard.guard.spec.ts`
- Directives: `alphabet-only`, `dragAndDrop`, `block-copy-paste`, `numbers-only`
- `file.pipe.spec.ts`

### 5.4 HTTP services rewritten with `HttpClientTestingModule` (29 specs)

These were converted from create-only stubs to method-level HTTP tests:

| Area | Specs |
|---|---|
| Auth / shared | `authentication.service.spec.ts` |
| Category | `category.service.spec.ts` |
| Category-mgr | `create-rfq`, `cat-procu-requests`, `cat-procu-quotations`, `auction`, `export-pdf` |
| BFS | `bfs-items.service.spec.ts` |
| Client | `client-service`, `approve-pr`, `create-pr-model` |
| Vendor | `rfq`, `vendor-quot`, `test-service` |
| Vendor-mgr | `vendor-mgr`, `vendor-invite`, `vendor-names`, `vendor-search`, `vendor-view-model` |
| Vendor-request | `vendor-req.service.spec.ts` |
| Vendor-registration | `vendor-registration`, `vendor-service`, `countries` |
| Common-share | `po`, `comments`, `excel` |
| Other | `invoices`, `ppos`, `raise-issues`, `uom` |

Largest service suites (by test count):
- `category.service.spec.ts` — 60 tests
- `cat-procu-requests.service.spec.ts` — 49 tests
- `create-rfq.service.spec.ts` — 38 tests
- `authentication.service.spec.ts` — 37 tests
- `bfs-items.service.spec.ts` — 34 tests
- `rfq.service.spec.ts` — 33 tests

### 5.5 Some small UI components improved
Examples with more than a single create assertion:
- `timeout-modal.component.spec.ts`
- `loader.component.spec.ts`
- `grid-page-info.component.spec.ts`
- `signup.component.spec.ts`
- `not-found` / `server-error` / unauthorized screens (partial)
- `stat` / `page-header` (partial)

---

## 6. What is NOT fully covered yet

| Gap | Detail |
|---|---|
| **Most component specs** | ~300+ layout/shared components still largely “should create” stubs |
| **Large components** | e.g. `vendor-reg`, `auctions`, `capex-auctions`, `cat-mgr-create-rfq-list`, `create-rfq-shared`, `bfs-items-list`, `quot-compare`, `pos`, PR modals — need deep method/branch tests |
| **Full gate verification** | Full-suite `npm run test:coverage && npm run coverage:check` has **not** been recorded as passing end-to-end |
| **Remote `git fetch`** | `https://github.com/Procucev2022/p2pui_v1.git` returned **Repository not found** (permissions/visibility); local work is present |

---

## 7. How to run locally

```bash
# Prefer Edge/Chrome auto-detect on Windows
npm run lint
npm run typecheck
npm run build -- --configuration=development
npm run test:coverage
npm run coverage:check
npm run test:summary
```

Or one shot:

```bash
npm run quality
```

**Reports produced:**
- `coverage/` — HTML + LCOV + JSON
- `coverage/coverage-check-summary.json` — gate result
- `coverage/pr-comment.md` — PR summary markdown
- `coverage/junit/test-results.xml` — test counts

---

## 8. Coverage contract (enforced)

For **every** application TypeScript file under `src/` (excluding `*.spec.ts`, `*.d.ts`, `test.ts`):

- Statements ≥ **90%**
- Branches ≥ **90%**
- Functions ≥ **90%**
- Lines ≥ **90%**

If any file is missing from the Istanbul report or below threshold on any metric → **error** (CI fails).

Global Jasmine timeout: **60 seconds**.

---

## 9. Bottom line

- **Documented & implemented:** GitHub PR quality Actions, Karma 90% per-file config, scripts, agent instructions, and deep coverage for **config/routing + most HTTP services + shared utils/guards/directives**.
- **Still open:** Deep unit tests for the bulk of **UI components** until `coverage:check` passes for the whole application.

---

*This file describes what was covered in the quality/coverage setup work. Update it as remaining component suites are deepened and the full gate passes.*
