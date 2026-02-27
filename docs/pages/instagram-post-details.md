**Route**
`/app/instagram/posts/[postId]`

**Purpose**
Show a single post with metadata and the latest comments. Provides actions to pick a winner or export comments.

**SEO**
- Title: `Деталі публікації | Pickly` (via `generateMetadata`, template)
- Not indexed (`robots: noindex, nofollow`), blocked by robots.txt

**Layout (Desktop)**
```text
[AppHeader]
[Left: Post details card]
[Right: Latest comments list]
[Fixed ActionBar at bottom: Pick winner | Filters]
```

**Layout (Mobile)**
```text
[AppHeader]
[Post details card]
[Comments list]
[Floating action button opens bottom sheet drawer]
```

**Main Content**
- Post image, likes, comments count, type, date, caption, and Instagram permalink.
- Latest comments list with virtualization and counts.

**Actions**
- Pick winner: routes to `/app/instagram/export/${postId}` (full 4-step giveaway wizard).
- Open post on Instagram.

**States**
- Skeletons for post details and comments.
- Comments empty state or error with retry.
- Full-page error state with back link if loading fails.
