import { test as base } from '@playwright/test';
import { TodoPage } from '../pages/TodoPage';

/**
 * Dependency-injected fixtures.
 *
 * Tests declare only what they need and receive ready-to-use instances:
 *
 *   test('example', async ({ todoPage }) => { ... });
 *
 * - `todoPage` : the TodoMVC Page Object bound to the test's `page`.
 */
export interface TestFixtures {
  todoPage: TodoPage;
}

export const test = base.extend<TestFixtures>({
  todoPage: async ({ page }, use) => {
    await use(new TodoPage(page));
  },
});

export { expect } from '@playwright/test';
