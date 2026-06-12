import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object for the Playwright TodoMVC demo (https://demo.playwright.dev/todomvc).
 *
 * All selectors are encapsulated here — tests never touch the DOM directly.
 * Uses role / placeholder / test-id locators with Playwright auto-waiting
 * (no hard sleeps anywhere).
 */
export class TodoPage extends BasePage {
  readonly path = '/todomvc';

  private readonly newTodoInput: Locator;
  private readonly todoItems: Locator;
  private readonly todoTitles: Locator;
  private readonly counter: Locator;
  private readonly clearCompleted: Locator;

  constructor(page: Page) {
    super(page);
    this.newTodoInput = page.getByPlaceholder('What needs to be done?');
    this.todoItems = page.getByTestId('todo-item');
    this.todoTitles = page.getByTestId('todo-title');
    this.counter = page.getByTestId('todo-count');
    this.clearCompleted = page.getByRole('button', { name: 'Clear completed' });
  }

  /** Wait until the app is ready for interaction. */
  async expectLoaded(): Promise<void> {
    await this.expectVisible(this.newTodoInput);
  }

  /** Add a single todo and submit with Enter. */
  async addTodo(title: string): Promise<void> {
    await this.fill(this.newTodoInput, title);
    await this.newTodoInput.press('Enter');
  }

  /** Add several todos in order. */
  async addTodos(titles: readonly string[]): Promise<void> {
    for (const title of titles) {
      await this.addTodo(title);
    }
  }

  /** All visible todo title texts, in order. */
  async titles(): Promise<string[]> {
    return this.todoTitles.allTextContents();
  }

  /** Locator for a specific todo row by its title. */
  todoByTitle(title: string): Locator {
    return this.todoItems.filter({ hasText: title });
  }

  /** Toggle a todo's completed state via its checkbox. */
  async toggle(title: string): Promise<void> {
    await this.todoByTitle(title).getByRole('checkbox').click();
  }

  /** Delete a todo by hovering its row and clicking the destroy button. */
  async remove(title: string): Promise<void> {
    const row = this.todoByTitle(title);
    await row.hover();
    await row.getByRole('button', { name: 'Delete' }).click();
  }

  /** Remove all completed todos. */
  async clearCompletedTodos(): Promise<void> {
    await this.click(this.clearCompleted);
  }

  /** Assert the number of todos currently rendered. */
  async expectCount(count: number): Promise<void> {
    await expect(this.todoItems).toHaveCount(count);
  }

  /** Assert a todo carries the `completed` class. */
  async expectCompleted(title: string): Promise<void> {
    await expect(this.todoByTitle(title)).toHaveClass(/completed/);
  }

  /** Assert the "items left" counter text, e.g. "2 items left". */
  async expectItemsLeft(text: string | RegExp): Promise<void> {
    await expect(this.counter).toHaveText(text);
  }
}
