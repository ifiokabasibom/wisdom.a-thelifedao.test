# TheLifeDAO UAT Playwright Tests (TypeScript)

## What this package contains
- Playwright test scaffold (TypeScript) with tests for **Sign up** and **Login** flows.
- `playwright.config.ts` configured to read from `.env`.
- Example `.env.example` for required environment variables.
- GitHub Actions workflow (see `.github/workflows/ci.yml`).

## Setup (local)
1. Install Node.js (v18 or later recommended).
2. Unzip or clone this project.
3. Run:
   ```bash
   npm install
   npx playwright install --with-deps
   ```
4. Copy `.env.example` to `.env` and update values (especially `INVITE_CODE`, `TEST_PASSWORD`, and `EXISTING_TEST_USER`).
5. Run tests:
   ```bash
   npm test
   ```

## Important notes
- The test selectors in `tests/*.spec.ts` use generic selectors that **must be adapted** to the actual UAT DOM. Inspect the page to confirm `name`/`id`/text values and update the tests accordingly.
- Sign up flow may require an invite code or waitlist approval. If the invite flow is asynchronous (requires email approval), either ask the HR contact for a working invite for tests or mock/stub invite behavior.
- Payment and wallet flows are intentionally **not** automated in this package (wallet interactions are hard to reliably automate in CI without specialized setups). Focus is on Sign up and Login as requested.
- If you want the tests written in JavaScript instead, let me know and I will provide a JS variant.

## Troubleshooting
- If tests fail due to selectors, update selectors in `tests/signup.spec.ts` and `tests/login.spec.ts`.
- To run in headed mode for debugging:
  ```bash
  npm run test:headed
  ```

## CI
- A GitHub Actions workflow is included at `.github/workflows/ci.yml`. Add repository secrets for `BASE_URL`, `INVITE_CODE`, `TEST_PASSWORD`, and `EXISTING_TEST_USER` to run tests in CI.
