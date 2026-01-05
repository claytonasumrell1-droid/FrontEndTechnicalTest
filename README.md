# FrontEndTechnicalTest

Quick start

1. Install dependencies

```bash
npm install
```

2. Run dev server

```bash
npm start
```

3. Run unit tests (may require allowing PowerShell scripts on Windows)

```bash
npm test
```

What I updated

- Added accessibility improvements (keyboard handlers, tabindex, ARIA roles) to timeline and work-order-card.
- Wired create/edit/delete flows so clicking or pressing Enter opens the panel with sensible defaults.
- Added responsive CSS and theme tokens based on extracted design.
- Added basic unit tests for `WorkDataService` and `TimelineComponent`.

Notes

- If `npm test` fails on Windows due to execution policy, run PowerShell as Administrator and run: `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned`.
- Tests use the repository's existing Angular test setup; if your environment differs, adjust `angular.json` test target.
# Frontend Technical Test (Angular 17)

Minimal Angular 17 scaffold created in this workspace.

Getting started:

1. Install dependencies:

```bash
npm install
```

2. Run the dev server:

```bash
npx ng serve --open
```

Notes:
- Requires Node.js 18+ and npm.
- This is a minimal scaffold — use `ng add` or the Angular CLI to extend.
# FrontEndTechnicalTest
Building a simple component where users can interact with work orders
