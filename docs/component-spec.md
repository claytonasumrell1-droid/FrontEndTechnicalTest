Component spec — based on src/assets/sketch/previews/preview.png

Summary
- Single-page layout with three main regions: Left filters/controls, Center timeline (primary content), Right detail panel/form.
- Top header with page title and primary actions.
- Timeline shows work centers as rows and work orders as cards; right panel is used for create/edit.
- Visual tokens: soft neutral background, muted labels, warm primary (from swatches), rounded cards, subtle shadows.

High-level components
1. Header
   - Responsibilities: show app title, global actions (Add, Search), responsive collapse.
   - Files: `src/app/components/header/header.component.*`
   - Inputs: none. Outputs: events for actions.

2. Sidebar / Filters
   - Responsibilities: show filters (status, timescale, search), work center list (collapsible), export/controls.
   - Files: `src/app/components/sidebar/sidebar.component.*`
   - Inputs: `workCenters[]` (optional). Outputs: `filterChange`, `selectWorkCenter`.

3. Timeline (existing)
   - Responsibilities: main timeline view, horizontal grid, render work orders.
   - Reuse: `src/app/timeline/timeline.component.ts` and `timeline-panel.component.ts` for panel UI.
   - Modify: accept filter inputs and expose events for `openCreate`, `openEdit`, `centerOnDate`.

4. WorkOrderCard
   - Responsibilities: small card rendered within timeline rows with status, name, dates; clickable to edit.
   - Files: `src/app/components/work-order-card/work-order-card.*`
   - Inputs: `order`. Outputs: `edit`, `openContext`.

5. RightPanel / Form (existing)
   - Responsibilities: show create/edit form; reuse `timeline-panel` behavior but decouple for app-level usage.
   - Reuse: `timeline-panel.component.ts` as `RightPanel` wrapper.

6. TopControls (timescale + view controls)
   - Responsibilities: timescale toggle (day/week/month), today button, zoom in/out.
   - Files: `src/app/components/top-controls/top-controls.*`
   - Inputs: `timescale`. Outputs: `timescaleChange`.

7. Shared UI
   - Button, Select, Input primitives mapped to Bootstrap/Ngb or small wrappers.

Data flow
- `WorkDataService` (existing) stays as single source of truth; components subscribe to it or get injected data via `@Input`.
- Filters modify the service query or emit events to parent `AppComponent` which passes props into `TimelineComponent`.

Assets & styles
- Fonts: `src/assets/sketch/fonts/*` (load in `src/styles.css` via @font-face). Use `Nunito` / `Circular Std` where available.
- Preview PNG: `src/assets/sketch/previews/preview.png` for visual reference and quick mock images.
- Theme tokens: add CSS variables in `:root` (colors from `sketch_summary/styles.json`): `--color-primary`, `--text-1`, `--bg-4`, `--muted`, `--radius`, `--shadow-1`.

Accessibility
- All interactive elements keyboard-focusable. Timeline cards have ARIA roles and `aria-expanded` for panel toggles.
- Ensure form fields have labels and the panel traps focus when open.

Initial priorities / rough estimates
- P1 (scaffold + static markup) — 1 day: Header, Sidebar, TopControls, WorkOrderCard, wire placeholders, add CSS tokens and load fonts.
- P2 (integration + interactions) — 1–2 days: Hook `WorkDataService`, implement open/create/edit/delete flows, reuse `timeline` components.
- P3 (polish & tests) — 1 day: responsive tweaks, a11y, small unit tests and a smoke e2e.

Immediate next actions (I will do next)
1. Scaffold component folders and placeholder files for: header, sidebar, top-controls, work-order-card, right-panel wrapper.
2. Add CSS variables to `src/styles.css` and load fonts from `src/assets/sketch/fonts`.
3. Wire header/top-controls into `AppComponent` with placeholders.

Do you want me to scaffold the component files now (I will create the folders and placeholder files)?
