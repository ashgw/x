import { Optional } from '../types/global';

export function getDomainAndTLD(url: string): Optional<{
  domain: string;
  tld: Optional<string>;
}> {
  const urlRegex = /^(?:https?:\/\/)?(?:www\.)?([^\/]+)(?:\/.*)?$/; // eslint-disable-line no-useless-escape
  const match = url.match(urlRegex);

  if (match) {
    const domainWithTLD = match[1];
    const parts = domainWithTLD.split('.');
    const tld = parts.pop();
    const domain = parts.join('.');
    if (!domain || !tld) {
      return null;
    }
    return { domain, tld };
  } else {
    return null;
  }
}
