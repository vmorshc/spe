import { z } from 'zod';

/**
 * Server-side environment variables schema
 * These variables should never be exposed to the client
 */
const serverEnvSchema = z.object({
  //   DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  REDIS_URL: z.string().optional(),
});

/**
 * Client-side environment variables schema
 * These variables are prefixed with NEXT_PUBLIC_ and safe for client exposure
 */
const clientEnvSchema = z.object({
  // Add client-safe environment variables here as needed
  // Example: NEXT_PUBLIC_API_URL: z.string().url().optional(),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

/**
 * Validate server environment variables
 * This should only be called on the server side
 */
export function validateServerEnv() {
  const result = serverEnvSchema.safeParse(process.env);

  if (!result.success) {
    console.error('❌ Invalid server environment variables:');
    console.error(result.error.flatten().fieldErrors);
    throw new Error('Server environment validation failed');
  }

  return result.data;
}

/**
 * Validate client environment variables
 * This can be called on both client and server
 */
export function validateClientEnv() {
  const clientEnv = Object.keys(clientEnvSchema.shape).reduce(
    (acc, key) => {
      acc[key] = process.env[key];
      return acc;
    },
    {} as Record<string, string | undefined>
  );

  const result = clientEnvSchema.safeParse(clientEnv);

  if (!result.success) {
    console.error('❌ Invalid client environment variables:');
    console.error(result.error.flatten().fieldErrors);
    throw new Error('Client environment validation failed');
  }

  return result.data;
}

// Export types for use in other files
export type ServerEnv = z.infer<typeof serverEnvSchema>;
export type ClientEnv = z.infer<typeof clientEnvSchema>;
