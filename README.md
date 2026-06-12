# Playwright UI Automation Framework

A production-ready, scalable UI test automation framework built with
**Playwright + TypeScript** using the **Page Object Model**, fixture-based
dependency injection, and a triple reporting stack
(Playwright HTML + Trace Viewer + Allure).

Target application under test:
**[Playwright TodoMVC demo](https://demo.playwright.dev/todomvc)**.

## Highlights

- **POM** with a reusable `BasePage` and encapsulated selectors (no selectors in tests).
- **Fixtures / DI** — tests request `todoPage` directly.
- **Triple reporting**: Playwright HTML + Trace Viewer + Allure.
- Auto-waiting only — **no `sleep`s**.
- Strict TypeScript, path aliases, validated env config.

## Project structure

```
.
├── pages/
│   ├── BasePage.ts             # shared, auto-waiting helpers
│   └── TodoPage.ts             # TodoMVC Page Object
├── fixtures/
│   └── testFixtures.ts         # dependency injection for page objects
├── tests/
│   └── ui/todo.spec.ts
├── utils/
│   ├── config.ts               # dotenv + zod-validated config
│   ├── testData.ts             # todo data factory
│   └── helpers.ts              # step() + attachJson() report helpers
├── reports/                    # generated (gitignored): html, allure, traces
├── playwright.config.ts
├── tsconfig.json
└── package.json
```

## Installation

```bash
npm install
npx playwright install   # download browser binaries
cp .env.example .env     # optional: override the base URL
```

Allure CLI is bundled via the `allure-commandline` dev dependency (run with
`npx allure ...` or the npm scripts below). To install it globally instead:

```bash
npm install -g allure-commandline   # or: brew install allure
```

## Running tests

```bash
npx playwright test              # full suite (chromium)
npm run test:ui                  # UI tests only
npm run test:headed              # see the browser
npm run test:debug               # Playwright Inspector
npm run typecheck                # tsc --noEmit
```

Cross-browser projects (Firefox / WebKit) are pre-defined but commented out in
[playwright.config.ts](playwright.config.ts) — uncomment to enable, then:
`npx playwright test --project=firefox`.

## Reporting

### Playwright HTML report

```bash
npm run report:html              # opens reports/html
```

### Trace Viewer (debugging failures)

Traces, screenshots and videos are **retained on failure**
(`trace: 'retain-on-failure'`). To debug a failing test:

```bash
npx playwright show-trace reports/test-results/<test-folder>/trace.zip
npm run trace reports/test-results/<test-folder>/trace.zip
```

The Trace Viewer lets you step through every action, inspect the DOM snapshot
at each step, and view network/console logs — the fastest way to diagnose UI
flakiness.

### Allure report

```bash
npm run allure:generate          # reports/allure-results -> reports/allure-report
npm run allure:open              # open the generated report
npm run allure:serve             # generate + open in one step
```

Raw commands:

```bash
npx allure generate reports/allure-results -o reports/allure-report --clean
npx allure open reports/allure-report
```

Tests use `test.step(...)` (via the `step()` helper) for readable grouping, and
failure screenshots, videos and traces are attached automatically.

## Architecture notes

- **Selector strategy** — TodoMVC ships `data-testid` attributes, so the Page
  Object favours `getByTestId` plus role/placeholder locators.
- **Config** — `utils/config.ts` loads `.env` and validates it with zod, failing
  fast with a clear message if `UI_BASE_URL` is malformed.
