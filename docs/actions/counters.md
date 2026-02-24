# Counter Actions

Source: `src/lib/actions/counters.ts`

Purpose: Read and increment the landing page visits counter.

## Methods

### `getLandingVisits()`
Takes: no params.
Returns: `Promise<number>`.
How it works: reads `landing_visits` from `CountersRepository`; returns `0` on error.

### `incrementLandingVisits()`
Takes: no params.
Returns: `Promise<number>`.
How it works: in production it increments `landing_visits`, otherwise it just returns the current count.
