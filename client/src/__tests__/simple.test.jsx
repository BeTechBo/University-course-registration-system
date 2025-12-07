import { describe, it, expect } from 'vitest';

describe('Simple Test Suite', () => {
  it('should pass basic math', () => {
    expect(1 + 1).toBe(2);
  });

  it('should pass string comparison', () => {
    expect('hello').toBe('hello');
  });

  it('should pass array comparison', () => {
    expect([1, 2, 3]).toHaveLength(3);
  });
});
