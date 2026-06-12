import { randomUUID } from 'node:crypto';

/**
 * A small, fixed set of todos used as default UI test data.
 */
export const DEFAULT_TODOS: readonly string[] = [
  'Buy groceries',
  'Write Playwright tests',
  'Ship the framework',
];

/**
 * Factory for unique, collision-free todo titles.
 *
 * Each call produces a fresh title so tests are independent and can run in
 * parallel without trampling on shared state.
 */
export function buildTodo(prefix = 'todo'): string {
  return `${prefix}-${randomUUID().slice(0, 8)}`;
}
