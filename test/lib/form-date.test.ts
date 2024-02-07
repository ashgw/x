import formatDate from '@/lib/funcs/form-date';

const defaultTestDate = new Date(2024, 3, 7);

beforeEach(() => {
  Date.now = jest.fn(() => defaultTestDate.getTime());
});

test('formatDate - past year', () => {
  const result = formatDate('2023-01-15');
  expect(result).toEqual('January 15, 2023 (1y ago)');
});

test('formatDate - today is a new day', () => {
  const result = formatDate('2024-03-07');
  expect(result).toEqual('March 7, 2024 (Today)');
});

test('formatDate - past months', () => {
  const result = formatDate('2024-01-01');
  expect(result).toEqual('January 1, 2024 (1mo ago)');
});

test('formatDate - Same month', () => {
  const result = formatDate('2024-02-01');
  expect(result).toEqual('February 1, 2024 (6d ago)');
});
