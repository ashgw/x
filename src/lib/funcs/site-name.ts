import { Optional } from '../types/global';

export function getSiteName(url: string): Optional<string> {
  const match = url.match(/^(?:https?:\/\/)?(?:www\.)?([^\/]+)(?:\/.*)?$/); // eslint-disable-line no-useless-escape
  if (match) {
    const parts = match[1].split('.');
    const tld = parts.pop();
    const domain = parts.join('.');
    if (!domain || !tld) {
      return null;
    }
    return domain + '.' + tld;
  } else {
    return null;
  }
}
