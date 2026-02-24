**Route**
`/`

**Purpose**
Marketing landing page, explains the product and drives login or waitlist signup.

**Layout (Desktop)**
```text
[Sticky Header: Logo | Nav links | Login/User]
[Hero: Left text + CTA | Right visual card]
[How It Works: 3-step cards]
[Why Trust Us: 2x2 cards]
[Benefits: 4 cards]
[Future Plans: 2x2 cards + Waitlist form]
[FAQ accordion + Support CTA]
[Footer: logo, socials, contacts, legal links]
```

**Layout (Mobile)**
```text
[Header: Logo + hamburger]
[Hero stacked]
[All sections stacked as single column]
[Footer stacked]
```

**Main Content**
- Product promise and CTA (start giveaway or waitlist).
- How-it-works steps and trust/benefit cards.
- Future plans list + email waitlist form.
- FAQ accordion and support contacts.

**Actions**
- Start giveaway (navigates to `/app/instagram/posts` when feature flag is on).
- Join waitlist (scrolls to form and submits email).
- Navigate to sections via header buttons.
- Open support links (Telegram, email) and legal pages.

**States**
- CTA switches between "Start giveaway" and "Join waitlist" based on `instagram_mvp` flag.
- Login button shows loading or user profile if authenticated.
