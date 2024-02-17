import { matchURL } from '@/lib/funcs/matchers';

describe('matchURL', () => {
  it('_', () => {
    expect(matchURL('http://localhost')).not.toBeNull();
  });

  it('_', () => {
    expect(matchURL('https://foo.com')).not.toBeNull();
  });

  it('_', () => {
    expect(matchURL('http://foo.com')).not.toBeNull();
  });

  it('_', () => {
    expect(matchURL('htts://foo.com')).toBeNull();
  });

  it('_', () => {
    expect(matchURL('http//foo.com')).toBeNull();
  });

  it('_', () => {
    expect(matchURL('foo.com')).toBeNull();
  });
});
