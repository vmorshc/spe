# Redis Integration - Simplified & Business-Oriented

This directory contains the simplified Redis integration for the SPE application focused on counter operations.

## Setup

1. Add your Redis URL to the environment variables:
   ```bash
   # Local Redis
   REDIS_URL=redis://localhost:6379
   
   # Redis with password
   REDIS_URL=redis://:password@localhost:6379
   
   # Upstash Redis (recommended for production)
   REDIS_URL=redis://default:password123@sweeping-stud-18397.upstash.io:6379
   ```

2. The application gracefully handles Redis unavailability by returning default values.

## Architecture

### Simple & Direct Structure
- **No complex wrappers**: Direct repository methods without unnecessary abstraction layers
- **Business-oriented APIs**: Endpoints like `/api/counters/landing-visits/` instead of generic patterns
- **Server-side rendering**: Initial counter values fetched on the server, avoiding extra API calls
- **Clean responses**: No internal Redis details exposed to clients

### Counters Repository

```typescript
import { CountersRepository } from '@/lib/redis/repositories/counters'

const counters = new CountersRepository()

// Simple, direct methods
const count = await counters.get('landing_visits')        // Returns number
const newCount = await counters.increment('landing_visits', 1) // Returns number
await counters.set('landing_visits', 100)                // Returns number
```

## API Endpoints

### POST /api/counters/landing-visits/
Increment the landing visits counter.

**Response:**
```json
{
  "count": 42
}
```

## Landing Page Implementation

### Server-Side Rendering
The landing page uses a hybrid approach:

1. **Server Component** (`Hero.tsx`): 
   - Fetches initial counter value on the server
   - Passes it to the client component as props
   - No loading state needed for initial render

2. **Client Component** (`HeroClient.tsx`):
   - Receives initial counter value
   - Displays it immediately (no loading spinner)
   - Increments counter after mount via API call
   - Updates display with new count

### Benefits
- **Better UX**: No loading states for initial counter display
- **SEO-friendly**: Counter value is server-rendered
- **Faster**: One less API call during initial page load
- **Resilient**: Works even if Redis is temporarily unavailable

## Error Handling

- All repository methods return sensible defaults on error
- Server-side errors are logged but don't break the UI
- Client sees clean, consistent responses
- No Redis implementation details exposed to frontend

## Key Improvements

1. **Simplified Repositories**: Removed complex `handleOperation` wrapper
2. **Business-Oriented APIs**: Domain-specific endpoints instead of generic ones
3. **Server-Side Rendering**: Initial data fetched on server, not client
4. **Clean Responses**: No internal Redis state exposed to clients
5. **Direct Structure**: Less abstraction, more maintainable code 