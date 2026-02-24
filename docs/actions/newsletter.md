# Newsletter Actions

Source: `src/lib/actions/newsletter.ts`

Purpose: Validate newsletter subscription requests, apply bot protection, rate limiting, and subscribe via MailerLite.

## Methods

### `subscribeToUpdates(formData)`
Takes: `formData: FormData` with `email`, honeypot field `website`, and optional `formTimestamp`.
Returns: `Promise<NewsletterSubscriptionResult>` (`success`, `validation-error`, or `api-error`).
How it works: validates input with Zod, applies honeypot and timing checks, enforces Redis rate limiting, and calls MailerLite.
