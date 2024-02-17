import { whereToGo } from '@/lib/funcs/sequel-blogs-redirection';

describe('whereToGo', () => {
  it('should generate the URL for the previous blog post', () => {
    expect(whereToGo('http://localhost-part-5', 'previous')).toBe(
      'http://localhostpart-4'
    );
  });

  it('should generate the URL for the next blog post', () => {
    expect(whereToGo('http://localhost-part-5', 'next')).toBe(
      'http://localhostpart-6'
    );
  });

  it('should return "#" for invalid URLs (no match)', () => {
    expect(whereToGo('http://localhost-part98', 'previous')).toBe('#');
    expect(whereToGo('ht-art-5', 'previous')).toBe('#');
    expect(whereToGo('httppart5', 'next')).toBe('#');
    expect(whereToGo('httppart-5', 'next')).toBe('#');
  });
});
