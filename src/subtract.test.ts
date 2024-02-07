import { describe, expect, it } from 'vitest';
import subtract from './subtract';

describe('Subtract', () => {
  it('should successfully subtract a number', () => {
    expect(subtract(2, 1)).eq(1);
  });
});
