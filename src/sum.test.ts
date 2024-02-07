import { describe, expect, it } from 'vitest';
import sum from './sum';

describe('Sum', () => {
  it('should successfully add a number', () => {
    expect(sum(2, 1)).eq(3);
  });
});
