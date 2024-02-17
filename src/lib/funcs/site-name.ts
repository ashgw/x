import { Optional } from '../types/global';
import { OPTIONAL_PROTOCOL_URL_REGEX } from './matchers';

export function getSiteName(url: string): Optional<string> {
  const match = url.match(OPTIONAL_PROTOCOL_URL_REGEX);
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
