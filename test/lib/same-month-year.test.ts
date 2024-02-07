import { isSameMonthAndYear } from '@/lib/funcs/dates';

const defaultTestDate = new Date(2024, 3, 7, 1, 1, 1);

beforeEach(() => {
  Date.now = jest.fn(() => defaultTestDate.getTime());
});

test('isSameMonthAndYear - same year not month', () => {
  const result = isSameMonthAndYear('2024-01-20T09:15:00-0400');
  expect(result).toEqual(false);
});

test('isSameMonthAndYear - same month not year', () => {
  const result = isSameMonthAndYear('2020-03-20T09:15:00-0400');
  expect(result).toEqual(false);
});
