**Route**
`/auth/select-profile`

**Purpose**
Let the user choose which Instagram Business/Creator profile to use after OAuth.

**Layout (Desktop)**
```text
[Centered title + subtitle]
[Grid of profile cards (2-3 columns)]
[Footer actions: Cancel]
```

**Layout (Mobile)**
```text
[Title + subtitle]
[Single-column list of profile cards]
[Cancel button]
```

**Main Content**
- Profile cards with avatar, username, page name, followers, posts.
- "Select this profile" CTA per card.

**Actions**
- Select a profile (stores session and redirects to the requested URL or home).
- Cancel and return to `/`.

**States**
- Loading spinner while fetching temporary profile list.
- Error state if `tempId` missing/expired or fetch fails.
- Empty state when no business/creator accounts are available.
