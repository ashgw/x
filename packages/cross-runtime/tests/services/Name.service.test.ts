import { describe, expect, it } from "vitest";

import { NamesService } from "../../services/Name.service";

describe("NamesService", () => {
  describe("getSiteName", () => {
    it("should return the site name for a valid URL", () => {
      const response = NamesService.getSiteName({
        url: "https://example.com",
      });
      expect(response).toEqual("Example");
    });

    it("should throw an error for an invalid URL", async () => {
      await expect(
        NamesService.getSiteName({
          url: "invalid-url",
        }),
      ).rejects.toThrow("Invalid URL");
    });
  });
});
