import 'dotenv/config';
import { z } from 'zod';

/**
 * Strongly-typed, validated runtime configuration.
 *
 * Environment variables are loaded from `.env` (see `.env.example`) and
 * validated with zod so the suite fails fast with a clear message if the
 * environment is misconfigured.
 */
const envSchema = z.object({
  UI_BASE_URL: z.string().url().default('https://demo.playwright.dev'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const issues = parsed.error.issues
    .map((i) => `  - ${i.path.join('.')}: ${i.message}`)
    .join('\n');
  throw new Error(`Invalid environment configuration:\n${issues}`);
}

const env = parsed.data;

export interface AppConfig {
  readonly uiBaseUrl: string;
}

export const config: AppConfig = {
  uiBaseUrl: env.UI_BASE_URL,
};
