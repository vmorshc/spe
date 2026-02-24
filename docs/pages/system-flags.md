**Route**
`/system/flags`

**Purpose**
Internal page to toggle feature flags for the current session.

**Layout (Desktop)**
```text
[Landing Header]
[Centered card: title + description]
[List of flag rows with toggle]
[Info panel about flags]
[Footer]
```

**Layout (Mobile)**
```text
[Header]
[Single-column card with stacked flag rows]
[Info panel]
[Footer]
```

**Main Content**
- Each flag shows name, description, current state, and internal flag key.
- Message banner for success/error feedback.

**Actions**
- Toggle a feature flag (persisted to session).

**States**
- Pending state shows a spinner and disables toggles.
