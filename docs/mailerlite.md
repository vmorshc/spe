# MailerLite Integration

Sources: `src/lib/mailerlite/*`, `src/lib/actions/newsletter.ts`.

Purpose: Subscribe users to the newsletter via MailerLite.

## Configuration

- `MAILERLITE_API_KEY` and `MAILERLITE_GROUP_ID` come from `serverConfig`.
- API base URL is `https://connect.mailerlite.com/api`.

## Client Methods

### `createOrUpdateSubscriber(email, fields?, groupIds?)`
Takes: `email: string`, optional custom `fields`, optional `groupIds` (defaults to `MAILERLITE_GROUP_ID`).
Returns: `Promise<MailerLiteSubscriberResponse>`.
How it works: POSTs a subscriber to `/subscribers` with `status: active`.

### `addSubscriberToGroup(subscriberIdOrEmail, groupId?)`
Takes: `subscriberIdOrEmail: string`, optional `groupId`.
Returns: `Promise<void>`.
How it works: POSTs to `/subscribers/{id}/groups/{groupId}`.

## Usage In The App

- `subscribeToUpdates` in `src/lib/actions/newsletter.ts` validates input, rate limits, then calls `mailerLiteClient.createOrUpdateSubscriber`.
