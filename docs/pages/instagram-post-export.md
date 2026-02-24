**Route**
`/app/instagram/posts/[postId]/exports/[exportId]`

**Purpose**
View a specific export of all comments for a post, track export progress, and download CSV.

**Note**: This page is being superseded by the new **Giveaway Wizard** at `/app/instagram/export/[postId]`. See `docs/pages/instagram-giveaway-wizard.md` for the redesigned multi-step flow with winner selection.

**Layout (Desktop)**
```text
[AppHeader]
[Left: Post details card]
[Right: Exported comments list]
[Fixed ActionBar: Pick winner | Download CSV | Filters]
```

**Layout (Mobile)**
```text
[AppHeader]
[Post details card]
[Export header with dropdown]
[Exported comments list]
[Floating action button opens bottom sheet drawer]
```

**Main Content**
- Post details (same as post detail view).
- Exported comments list with infinite scroll.
- Export dropdown to switch between exports (mobile header).

**Actions**
- Download CSV for this export.
- Pick winner (placeholder).
- Switch to another export (dropdown).

**States**
- Export progress modal while export is running.
- Export failure message with retry.
- Comment list loads incrementally and stops when complete.
