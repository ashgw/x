// TODO: fix ts-roids
// import { Optional } from 'ts-roids';
type Optional<T> = T | null;
export const URL_REGEX = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}$/; // eslint-disable-line no-useless-escape
export const OPTIONAL_PROTOCOL_URL_REGEX =
  /^(?:https?:\/\/)?(?:www\.)?([^\/]+)(?:\/.*)?$/; // eslint-disable-line no-useless-escape

export class NamesService {
  public static matchURL(dto: { url: string }): Optional<RegExpMatchArray> {
    /* eslint-disable @typescript-eslint/prefer-regexp-exec */
    return dto.url.match(URL_REGEX);
  }
  public static getSiteName({ url }: { url: string }): Optional<string> {
    const match = url.match(OPTIONAL_PROTOCOL_URL_REGEX);
    if (match) {
      const parts = match[1]?.split('.');
      if (!parts) {
        return null;
      }
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
}
