import { afterAll, beforeAll, beforeEach, vi } from 'vitest';
import { RedisContainer, StartedRedisContainer } from '@testcontainers/redis';
import Redis from 'ioredis';

declare global {
  // eslint-disable-next-line no-var
  var __redisContainer: StartedRedisContainer | undefined;
  // eslint-disable-next-line no-var
  var __redisClient: Redis | undefined;
}

// Minimal env for server config validation
process.env.NEXT_PUBLIC_NODE_ENV = process.env.NEXT_PUBLIC_NODE_ENV || 'test';
process.env.NEXT_PUBLIC_DOMAIN = process.env.NEXT_PUBLIC_DOMAIN || 'http://localhost:3001';
process.env.FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID || 'x';
process.env.FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET || 'x';
process.env.SESSION_SECRET =
  process.env.SESSION_SECRET || '12345678901234567890123456789012';
process.env.MAILERLITE_API_KEY =
  process.env.MAILERLITE_API_KEY || '12345678901234567890123456789012';
process.env.MAILERLITE_GROUP_ID = process.env.MAILERLITE_GROUP_ID || '1';

// Stub Next.js cookies API so iron-session can work without request scope
vi.mock('next/headers', () => {
  const cookieStore = {
    get: (_key: string) => undefined,
    getAll: () => [],
    set: (_key: string, _value: string) => {},
    delete: (_key: string) => {},
    has: (_key: string) => false,
    toString: () => '',
  } as const;
  return { cookies: () => cookieStore };
});

// Stub iron-session to read a test session id from env
vi.mock('iron-session', () => {
  return {
    getIronSession: vi.fn(async () => {
      return {
        sessionId: process.env.__TEST_SESSION_ID,
        save: async () => {},
      };
    }),
  };
});

// Stub Redis singleton to return the Testcontainers client
vi.mock('@/lib/redis/client', () => {
  return {
    default: {
      getInstance: () => globalThis.__redisClient,
      disconnect: async () => { await globalThis.__redisClient?.disconnect(); },
    },
  };
});

beforeAll(async () => {
  // Start Redis container once for all tests
  const container = await new RedisContainer().start();
  const url = container.getConnectionUrl();
  const client = new Redis(url);
  await client.flushall();
  globalThis.__redisContainer = container;
  globalThis.__redisClient = client;
}, 120_000);

afterAll(async () => {
  await globalThis.__redisClient?.disconnect();
  if (globalThis.__redisContainer) {
    await globalThis.__redisContainer.stop();
  }
});

// Create a fresh user session before each test so getCurrentUser works without mocking
beforeEach(async () => {
  const { userRepository } = await import('@/lib/redis/repositories/users');
  const sessionId = await userRepository.createSession({
    instagramId: 'insta_1',
    username: 'tester',
    profilePicture: '',
    followersCount: 0,
    mediaCount: 0,
    accessToken: 'fake-token',
    pageId: 'page_1',
    pageName: 'page',
  });
  process.env.__TEST_SESSION_ID = sessionId;
});


