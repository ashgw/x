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

  describe("formatDate", () => {
    it("formats a date from years ago correctly", () => {
      const result = DateService.formatDate({ stringDate: "2023-03-10" });
      expect(result).toBe("March 10, 2023 (2y ago)");
    });

    it("formats a date from months ago correctly", () => {
      const result = DateService.formatDate({ stringDate: "2024-12-10" });
      expect(result).toBe("December 10, 2024 (3mo ago)");
    });

    it("formats a date from days ago correctly", () => {
      const result = DateService.formatDate({ stringDate: "2025-03-07" });
      expect(result).toBe("March 7, 2025 (3d ago)");
    });

    it("formats today's date correctly", () => {
      const result = DateService.formatDate({ stringDate: "2025-03-10" });
      expect(result).toBe("March 10, 2025 (Today)");
    });

    it("handles dates without T correctly", () => {
      const result = DateService.formatDate({ stringDate: "2025-03-09" });
      expect(result).toBe("March 9, 2025 (1d ago)");
    });
  });

  describe("isSameMonthAndYear", () => {
    it("returns true for same month and year", () => {
      const result = DateService.isSameMonthAndYear({
        stringDate: "2025-03-15",
      });
      expect(result).toBe(true);
    });

    it("returns false for different month", () => {
      const result = DateService.isSameMonthAndYear({
        stringDate: "2025-04-15",
      });
      expect(result).toBe(false);
    });

    it("returns false for different year", () => {
      const result = DateService.isSameMonthAndYear({
        stringDate: "2024-03-15",
      });
      expect(result).toBe(false);
    });

    it("returns false for different month and year", () => {
      const result = DateService.isSameMonthAndYear({
        stringDate: "2023-05-15",
      });
      expect(result).toBe(false);
    });
  });
});
