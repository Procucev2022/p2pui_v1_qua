# Kiro Agent Rules

## Mandatory 90% Per-File Unit Test Code Coverage Benchmark

- Every application TypeScript file under `src/` must achieve at least **90% coverage** across ALL parameters:
  - Statements (>= 90%)
  - Branches (>= 90%)
  - Functions (>= 90%)
  - Lines (>= 90%)
- Zero file exemptions. No skipped files allowed.
- All unit tests must conform to global timeouts (60 seconds default per test via `jasmine.timeoutInterval: 60000`).
- Whenever making ANY code change, add corresponding unit tests and run:
  ```bash
  npm run quality
  ```
- If any file falls below 90% on any parameter, the check throws an error and fails the build. Fix all coverage deficiencies before completing.
