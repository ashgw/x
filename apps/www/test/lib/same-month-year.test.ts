import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DateService } from '~/lib/services/Date.service';

const defaultTestDate = new Date(2024, 3, 7, 1, 1, 1);

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(defaultTestDate);
});

describe('DateService.isSameMonthAndYear', () => {
  it('returns false when the same year but not the same month', () => {
    const result = DateService.isSameMonthAndYear({
      stringDate: '2024-01-20T09:15:00-0400',
    });
    expect(result).toEqual(false);
  });

  it('returns false when the same month but not the same year', () => {
    const result = DateService.isSameMonthAndYear({
      stringDate: '2020-03-20T09:15:00-0400',
    });
    expect(result).toEqual(false);
  });
});
