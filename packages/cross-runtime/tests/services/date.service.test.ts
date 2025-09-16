import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

import { DateService } from "../../services";

describe("DateService", () => {
  // Mock the current date to March 10, 2025, for consistent testing
  beforeAll(() => {
    vi.setSystemTime(new Date("2025-03-10T12:00:00"));
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  const testCases = [
    { input: "2023-03-10", expected: "March 10, 2023 (2y ago)" },
    { input: "2024-12-10", expected: "December 10, 2024 (3mo ago)" },
    { input: "2025-03-07", expected: "March 7, 2025 (3d ago)" },
    { input: "2025-03-10", expected: "March 10, 2025 (Today)" },
    { input: "2025-03-09", expected: "March 9, 2025 (1d ago)" },
  ];

  describe("formatDate", () => {
    testCases.forEach(({ input, expected }) => {
      it(`formats date ${input} correctly`, () => {
        const result = DateService.formatDate({ stringDate: input });
        expect(result).toBe(expected);
      });
    });
  });

  const sameMonthYearCases = [
    { input: "2025-03-15", expected: true },
    { input: "2025-04-15", expected: false },
    { input: "2024-03-15", expected: false },
    { input: "2023-05-15", expected: false },
  ];

  describe("isSameMonthAndYear", () => {
    sameMonthYearCases.forEach(({ input, expected }) => {
      it(`returns ${expected} for date ${input}`, () => {
        const result = DateService.isSameMonthAndYear({ stringDate: input });
        expect(result).toBe(expected);
      });
    });
  });
});
