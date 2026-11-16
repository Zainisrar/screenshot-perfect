# TEA — Tender Execution Agent

## Build
- Replace the template home screen with a responsive tender operations workspace for GREEN DigitALL, using a deep-green, white, and grey design system.
- Create typed tender, workflow, approval, requirement, document, supplier/quote, costing, and audit data models, plus eight realistic mock tenders across the requested UN agencies and Pacific countries.
- Keep all mock data and asynchronous in-memory operations behind typed service functions; do not add backend, authentication, database, or API calls.
- Add a role switcher for CEO Bernard George, Solution Engineering Lead Kowsalya, and Admin Zain. Only the allowed role sees each approval action; every action records an audit entry.
- Implement the dashboard, filterable tenders list, tender detail tabs, role-specific My Approvals, and Admin Settings.
- Show tender workflow progress, three deadline formats, short-deadline warnings, owner/backup-owner requirements, version-bound approvals, amendment voiding, quote expiry, costing margin warnings, and AI-draft/pending-email labels.

## Technical details
- Use the existing TanStack Start route at `/`, shadcn controls, and semantic tokens in `src/styles.css`.
- Keep models under `src/types`, mock fixtures under `src/mocks`, and in-memory services under `src/services`.
- Add a small tested deadline conversion utility for original notice time, UTC, and PNG time; include tests for the provided FAO deadline and approval-role rules where applicable.
- Add app-specific route metadata and preserve the existing root shell and router.
