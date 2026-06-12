import { Locator, Page, expect } from '@playwright/test';

/**
 * Base class for all Page Objects.
 *
 * Provides reusable navigation and interaction helpers built on Playwright's
 * auto-waiting locators — there are NO hard sleeps anywhere in the framework.
 * Selectors live inside Page Objects (never in test files).
 */
export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  /** Each page declares its own route relative to the configured baseURL. */
  abstract readonly path: string;

  /** Navigate to this page's route and wait for the network to settle. */
  async goto(): Promise<void> {
    await this.page.goto(this.path, { waitUntil: 'domcontentloaded' });
  }

  /**
   * Preferred locator strategy: stable test ids.
   * Conduit ships no data-testid attributes, so this is provided as the
   * recommended pattern for when the framework targets your own application.
   */
  protected byTestId(testId: string): Locator {
    return this.page.getByTestId(testId);
  }

  /** Click and let Playwright auto-wait for actionability. */
  protected async click(locator: Locator): Promise<void> {
    await locator.click();
  }

  /** Replace any existing value and type fresh input. */
  protected async fill(locator: Locator, value: string): Promise<void> {
    await locator.fill(value);
  }

  /** Assert a locator is visible (used by sub-pages for readiness checks). */
  protected async expectVisible(locator: Locator): Promise<void> {
    await expect(locator).toBeVisible();
  }
}
