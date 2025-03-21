import { describe, expect, test } from "vitest";

import { NamesService } from "../../services/Name.service";

const getSiteName = NamesService.getSiteName.bind(NamesService);

const testCases = [
  {
    description: "should extract domain and TLD from a valid URL",
    url: "https://www.example.com/path/to/page",
    expected: "example.com",
  },
  {
    description: 'should handle URLs without "www."',
    url: "https://example.com/path/to/page",
    expected: "example.com",
  },
  {
    description: 'should handle URLs without "https://"',
    url: "www.example.com/path/to/page",
    expected: "example.com",
  },
  {
    description: "should handle URLs with subdomains",
    url: "https://sub.domain.example.com/path/to/page",
    expected: "sub.domain.example.com",
  },
  {
    description: "should handle URLs without path",
    url: "https://www.example.com",
    expected: "example.com",
  },
  {
    description: "should return null for invalid URL format",
    url: "invalid-url",
    expected: null,
  },
];

describe("extractDomainAndTLD", () => {
  testCases.forEach(({ description, url, expected }) => {
    test(description, () => {
      const result = getSiteName({ url });
      expect(result).toEqual(expected);
    });
  });
});
