import { test } from '@playwright/test';

/**
 * Wrap a block of logic in a named Allure/Playwright step so reports read as a
 * human-readable narrative. Returns the inner value for convenient chaining.
 */
export async function step<T>(title: string, body: () => Promise<T>): Promise<T> {
  return test.step(title, body);
}

/**
 * Attach an arbitrary JSON-serialisable payload (e.g. an API response) to the
 * current test so it surfaces in the HTML and Allure reports.
 */
export async function attachJson(name: string, data: unknown): Promise<void> {
  await test.info().attach(name, {
    body: JSON.stringify(data, null, 2),
    contentType: 'application/json',
  });
}
