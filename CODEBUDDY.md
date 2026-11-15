# tinyshop-api — project rules for CodeBuddy

## Stack
- Node.js 20+, ES modules, **zero runtime dependencies**. Tests use `node:test` (`npm test`).

## Code style
- Small pure functions; money is always rounded with `round2()` from `src/pricing.js`.
- Throw `RangeError` for invalid numeric input; never return `NaN`.

## Commits & PRs
- Conventional Commits (`fix:`, `feat:`, `test:`, `docs:`, `ci:`).
- One logical change per commit. Every behaviour change ships with a test.
- PR description: *What*, *Why*, *How tested*.

## Review checklist (used by CI review jobs)
1. Correctness of money maths (tax after discount, rounding).
2. Input validation and HTTP status codes.
3. Security: path traversal, injection, secrets in code or logs.
4. Tests cover the change. Keep comments short and actionable.
