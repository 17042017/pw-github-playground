import { test, expect } from '../../fixtures/testFixtures';
import { DEFAULT_TODOS, buildTodo } from '../../utils/testData';
import { step } from '../../utils/helpers';

/**
 * UI tests for the Playwright TodoMVC demo.
 * Selectors live in the TodoPage Page Object; tests express intent only.
 */
test.describe('TodoMVC (UI)', () => {
  test.beforeEach(async ({ todoPage }) => {
    await todoPage.goto();
    await todoPage.expectLoaded();
  });

  test('adds new todos to the list', async ({ todoPage }) => {
    await step('add the default todos', () => todoPage.addTodos(DEFAULT_TODOS));

    await todoPage.expectCount(DEFAULT_TODOS.length);
    expect(await todoPage.titles()).toEqual([...DEFAULT_TODOS]);
    await todoPage.expectItemsLeft('3 items left');
  });

  test('completes a todo', async ({ todoPage }) => {
    const todo = buildTodo('complete-me');

    await step('add a todo', () => todoPage.addTodo(todo));
    await step('toggle it complete', () => todoPage.toggle(todo));

    await todoPage.expectCompleted(todo);
    await todoPage.expectItemsLeft('0 items left');
  });

  test('clears completed todos', async ({ todoPage }) => {
    await step('seed two todos', () => todoPage.addTodos(['keep me', 'remove me']));
    await step('complete one and clear', async () => {
      await todoPage.toggle('remove me');
      await todoPage.clearCompletedTodos();
    });

    await todoPage.expectCount(1);
    expect(await todoPage.titles()).toEqual(['keep me']);
  });

  test('deletes a todo', async ({ todoPage }) => {
    await step('seed two todos', () => todoPage.addTodos(['stay', 'delete']));
    await step('delete one', () => todoPage.remove('delete'));

    await todoPage.expectCount(1);
    expect(await todoPage.titles()).toEqual(['stay']);
    await(500);
  });
});
