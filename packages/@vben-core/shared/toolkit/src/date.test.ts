import { describe, expect, it } from 'vitest';

import { formatDate, formatDateTime } from './date';

describe('formatDate', () => {
  it('should return "2023-01-01" when passed new Date("2023-01-01T00:00:00.000Z")', () => {
    const date = new Date('2023-01-01T00:00:00.000Z');
    const actual = formatDate(date);
    expect(actual).toBe('2023-01-01');
  });

  it('should return "2023-01-01" when passed new Date("2023-01-01T00:00:00")', () => {
    const date = new Date('2023-01-01T00:00:00.000Z');
    const actual = formatDate(date, 'YYYY-MM-DD');
    expect(actual).toBe('2023-01-01');
  });

  it('should throw an error when passed an invalid date', () => {
    const date = '2018-10-10-10-10-10';
    expect(formatDate(date)).toBe('Invalid Date');
  });
});

describe('formatDateTime', () => {
  it('should return "2023-01-01" when passed new Date("2023-01-01T00:00:00.000Z")', () => {
    const date = new Date('2023-01-01T00:00:00.000Z');
    const actual = formatDateTime(date);
    expect(actual).toBe('2023-01-01 08:00:00');
  });

  it('should throw an error when passed an invalid date', () => {
    const date = '2018-10-10-10-10-10';
    expect(formatDateTime(date)).toBe('Invalid Date');
  });
});
