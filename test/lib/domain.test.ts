import { getSiteName } from '@/lib/funcs/site-name';

describe('extractDomainAndTLD', () => {
  test('should extract domain and TLD from a valid URL', () => {
    const url = 'https://www.example.com/path/to/page';
    const result = getSiteName(url);

    expect(result).toEqual('example.com');
  });

  test('should handle URLs without "www."', () => {
    const url = 'https://example.com/path/to/page';
    const result = getSiteName(url);

    expect(result).toEqual('example.com');
  });

  test('should handle URLs without "https://"', () => {
    const url = 'www.example.com/path/to/page';
    const result = getSiteName(url);

    expect(result).toEqual('example.com');
  });

  test('should handle URLs with subdomains', () => {
    const url = 'https://sub.domain.example.com/path/to/page';
    const result = getSiteName(url);

    expect(result).toEqual('sub.domain.example.com');
  });

  test('should handle URLs without path', () => {
    const url = 'https://www.example.com';
    const result = getSiteName(url);

    expect(result).toEqual('example.com');
  });

  test('should return null for invalid URL format', () => {
    const url = 'invalid-url';
    const result = getSiteName(url);

    expect(result).toBeNull();
  });
});
