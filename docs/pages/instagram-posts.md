**Route**
`/app/instagram/posts`

**Purpose**
Main authenticated area to browse Instagram posts and choose a post for a giveaway.

**Layout (Desktop)**
```text
[AppHeader: back, logo, title, logout]
[Profile header: avatar, stats, refresh]
[Tabs: Posts | Reels (disabled)]
[Posts grid (3 columns) + infinite scroll loader]
```

**Layout (Mobile)**
```text
[AppHeader]
[Profile header stacked]
[Tabs]
[Posts grid (3 columns)
```

**Main Content**
- Profile header with stats and refresh action.
- Posts grid with hover overlays (likes/comments).

**Actions**
- Refresh Instagram data (clears cache, reloads).
- Open a post to view details.
- Logout from header.

**States**
- Loading skeletons for profile and grid.
- Empty state when no posts are available.
- Error boundary page for fetch failures.
- Auth guard prompts login if session is missing.
