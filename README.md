# Work Order Schedule Timeline - Frontend Technical Test

An interactive timeline component for visualizing and managing work orders across multiple work centers in a manufacturing ERP system.

## Overview

This Angular 17 application implements a fully-functional work order scheduling timeline with:
- Interactive timeline grid with Day/Week/Month zoom levels
- Work order bars with status indicators and positioning
- Create/Edit slide-out panel with form validation
- Overlap detection preventing scheduling conflicts
- Keyboard accessibility and ARIA support
- Responsive design with mobile considerations

## Quick Start

### Prerequisites
- Node.js 18+ and npm

### Installation & Running

1. **Install dependencies**

```bash
npm install
```

2. **Run dev server**

```bash
npm start
```

The application will be available at `http://localhost:4200`

3. **Run unit tests**

```bash
npm test
```

Tests run in headless Chrome with custom stability flags optimized for Windows.

### Troubleshooting

**Tests on Windows:**
If Chrome Headless has issues, run tests in interactive mode:
```bash
npx ng test --browsers=Chrome
```

**PowerShell Execution Policy:**
If scripts fail to run, enable them with:
```bash
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

## Implementation Approach

### Architecture

The application follows Angular best practices with:
- **Standalone components** for modularity
- **Reactive Forms** (FormGroup/FormControl) for all form handling
- **Service-based state management** via `WorkDataService` using RxJS BehaviorSubjects
- **Type-safe models** with strict TypeScript configuration

### Key Components

**Timeline Component** (`src/app/timeline/`)
- Main timeline grid with horizontal scrolling
- Work center rows with work order bars
- Date positioning calculations for Day/Week/Month views
- Click-to-create functionality with date inference from position
- Current day indicator

**Timeline Panel Component** (`src/app/timeline/timeline-panel.component.*`)
- Slide-out panel for create/edit operations
- Reactive form validation (required fields, date ranges, overlap detection)
- Dual mode: create (new orders) / edit (existing orders)
- Integration with @ng-bootstrap datepickers

**Work Order Card Component** (`src/app/components/work-order-card/`)
- Reusable work order display with status badges
- Keyboard accessible (Enter/Space to edit)
- Embedded in timeline bars

**Work Data Service** (`src/app/services/work-data.service.ts`)
- Centralized state management for work centers and orders
- CRUD operations (add, update, delete)
- Overlap detection logic
- RxJS observables for reactive data flow

### Design Implementation

**Fonts & Theme:**
- Extracted design assets from Sketch file (fonts, colors, swatches)
- CSS variables mapped to exact hex values from design system
- `@font-face` rules for Nunito and Circular Std fonts
- Located in `src/assets/sketch/`

**Styling:**
- SCSS with component-scoped styles
- Global theme variables in `src/styles.css`
- Responsive breakpoints for mobile/tablet
- Status-based color coding (Open: blue, In Progress: gradient, Complete: green, Blocked: yellow)

### Libraries Used

| Library | Purpose | Why |
|---------|---------|-----|
| `@angular/core` v17 | Framework | Required; latest stable Angular |
| `@angular/forms` | Reactive Forms | Required; FormGroup/FormControl validation |
| `@ng-bootstrap/ng-bootstrap` | Date picker | Required; `ngb-datepicker` for date selection |
| `@ng-select/ng-select` | Dropdowns | Required; status selection dropdown |
| `rxjs` | Reactive state | Observable patterns for data flow |
| `zone.js` | Change detection | Angular runtime dependency |
| `karma` + `jasmine` | Unit testing | Test infrastructure |
| `cypress` | E2E testing | End-to-end test scenarios |

### Data Structure

All documents follow a consistent pattern:

```typescript
interface WorkCenterDocument {
  docId: string;
  docType: 'workCenter';
  data: { name: string };
}

interface WorkOrderDocument {
  docId: string;
  docType: 'workOrder';
  data: {
    name: string;
    workCenterId: string;
    status: 'open' | 'in-progress' | 'complete' | 'blocked';
    startDate: string; // ISO format
    endDate: string;
  };
}
```

**Sample data** (`src/app/sample-data.ts`):
- 5 work centers (Extrusion Line A, CNC Machine 1, Assembly Station, Quality Control, Packaging Line)
- 8+ work orders demonstrating all status types
- Non-overlapping schedules with realistic date ranges

## Features Implemented

### Core Requirements ✅
- [x] Timeline grid with Day/Week/Month zoom levels
- [x] Work order bars positioned by dates with status colors
- [x] Create panel (click empty area to open with pre-filled date)
- [x] Edit panel (three-dot menu → Edit)
- [x] Delete functionality (three-dot menu → Delete)
- [x] Form validation (required fields, date ranges)
- [x] Overlap detection with error feedback
- [x] Current day indicator (vertical red line)
- [x] Horizontal scrolling with fixed left panel
- [x] Responsive layout (mobile breakpoints)

### Bonus Features ✅
- [x] Keyboard navigation (Tab, Enter, Space, Delete keys)
- [x] Accessibility (ARIA roles, labels, tabindex)
- [x] Smooth animations (panel slide-in/out)
- [x] Unit tests (WorkDataService, TimelineComponent)
- [x] E2E test skeleton (Cypress)
- [x] GitHub Actions CI workflow
- [x] Custom Chrome launcher for stable headless testing

### Testing

**Unit Tests:**
- `WorkDataService`: CRUD operations, overlap detection
- `TimelineComponent`: component instantiation, data binding
- `Timeline create flow`: panel opening, date pre-fill

**Test Infrastructure:**
- Karma + Jasmine configured with custom Chrome launcher
- Headless execution with stability flags (`--no-sandbox`, `--disable-gpu`)
- Async/await pattern using `firstValueFrom` to avoid hanging subscriptions
- 6/6 tests passing

**E2E Tests:**
- Cypress configuration at `cypress.config.js`
- Basic spec skeleton in `cypress/e2e/app_spec.cy.js`
- Run with `npm run e2e` (interactive) or `npm run e2e:run` (headless)

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── header/
│   │   ├── sidebar/
│   │   ├── top-controls/
│   │   ├── work-order-card/       # Reusable order display
│   │   └── right-panel/
│   ├── services/
│   │   └── work-data.service.ts   # State management
│   ├── timeline/
│   │   ├── timeline.component.*   # Main timeline grid
│   │   └── timeline-panel.component.*  # Create/Edit panel
│   ├── models.ts                   # TypeScript interfaces
│   ├── sample-data.ts              # Hardcoded work centers/orders
│   └── app.component.*             # Root component
├── assets/
│   └── sketch/                     # Extracted design assets
│       ├── fonts/                  # Nunito, Circular Std
│       └── previews/               # Design preview image
├── styles.css                      # Global theme, CSS variables
└── test.ts                         # Test bootstrap

karma.conf.js                       # Karma test runner config
cypress.config.js                   # Cypress E2E config
tsconfig.json                       # TypeScript base config
tsconfig.app.json                   # App-specific TS config (excludes specs)
tsconfig.spec.json                  # Test-specific TS config
```

## Technical Decisions

### Date Positioning
- Calculate pixel offsets from `visibleStart` date based on cell width
- Recalculate on zoom level change
- Handle scroll offset to maintain view stability

### Form State
- Single panel component with mode flag (`'create' | 'edit'`)
- Pre-fill form on create with clicked date
- Reset form state when switching modes
- Validate on submit, not on every keystroke

### Overlap Detection
- Implemented in `WorkDataService.hasOverlap()`
- Checks if date ranges intersect on same work center
- Excludes current order when editing
- Runs before save, blocks invalid operations

### Accessibility
- Keyboard handlers on timeline rows and order bars
- `role="button"`, `tabindex="0"` for interactive elements
- `aria-label` for screen readers
- Enter/Space to activate, Delete to remove orders

## CI/CD

GitHub Actions workflow (`.github/workflows/ci.yml`):
- Runs on push to `main`/`master` branches
- Installs dependencies with `npm ci`
- Executes unit tests with `npm test`
- Starts dev server and runs Cypress e2e tests

## Future Enhancements

Potential improvements marked with `@upgrade` comments in code:

- [ ] localStorage persistence for work orders
- [ ] Infinite horizontal scroll (dynamic column loading)
- [ ] "Today" button to jump to current date
- [ ] Tooltips on order bar hover
- [ ] Drag-and-drop to reschedule orders
- [ ] Undo/redo functionality
- [ ] Export to PDF/Excel
- [ ] Real-time collaboration features

## Notes

- TypeScript strict mode enabled
- All Jasmine types properly configured in `tsconfig.json`
- Specs excluded from app build (`tsconfig.app.json`) to prevent type conflicts
- Custom Karma temp directory to avoid Windows temp folder issues
- Tests use `firstValueFrom` instead of callback subscriptions for cleaner async handling

---

**Built with Angular 17 | TypeScript 5.2 | RxJS 7.8 | Bootstrap 5**
