import { getDomainAndTLD } from '@/lib/funcs/domain';

describe('extractDomainAndTLD', () => {
  test('should extract domain and TLD from a valid URL', () => {
    const url = 'https://www.example.com/path/to/page';
    const result = getDomainAndTLD(url);

    expect(result).toEqual({
      domain: 'example',
      tld: 'com',
    });
  });

  test('should handle URLs without "www."', () => {
    const url = 'https://example.com/path/to/page';
    const result = getDomainAndTLD(url);

    expect(result).toEqual({
      domain: 'example',
      tld: 'com',
    });
  });

  test('should handle URLs without "https://"', () => {
    const url = 'www.example.com/path/to/page';
    const result = getDomainAndTLD(url);

    expect(result).toEqual({
      domain: 'example',
      tld: 'com',
    });
  });

  test('should handle URLs with subdomains', () => {
    const url = 'https://sub.domain.example.com/path/to/page';
    const result = getDomainAndTLD(url);

    expect(result).toEqual({
      domain: 'sub.domain.example',
      tld: 'com',
    });
  });

  test('should handle URLs without path', () => {
    const url = 'https://www.example.com';
    const result = getDomainAndTLD(url);

    expect(result).toEqual({
      domain: 'example',
      tld: 'com',
    });
  });

  test('should return null for invalid URL format', () => {
    const url = 'invalid-url';
    const result = getDomainAndTLD(url);

    expect(result).toBeNull();
  });
});
